import * as vscode from 'vscode';
import * as path from 'path';
import * as fn from './functions';

export function activate(context: vscode.ExtensionContext) {
	const goToSchemaCommand = vscode.commands.registerCommand('rails-table-schema.goToSchema', async () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const document = editor.document;
		const relativePath = vscode.workspace.asRelativePath(document.fileName, false);
		const modelName = fn.getModelNameFromPath(relativePath);
		if (!modelName) {
			return;
		}

		const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
		if (!workspaceFolder) {
			return;
		}

		const schemaFilePath = path.join(workspaceFolder.uri.fsPath, 'db', 'schema.rb');
		try {
			const schemaFileUri = vscode.Uri.file(schemaFilePath);
			const schemaDoc = await vscode.workspace.openTextDocument(schemaFileUri);
			const targetEditor = await vscode.window.showTextDocument(schemaDoc);

			const targetLine = findSchemaLine(schemaDoc, modelName);
			if (targetLine !== null) {
				const position = new vscode.Position(targetLine, 0);
				targetEditor.selection = new vscode.Selection(position, position);
				targetEditor.revealRange(new vscode.Range(position, position));
			}
		} catch (error) {
			vscode.window.showErrorMessage('Could not open schema.rb file.');
		}
	});

	context.subscriptions.push(goToSchemaCommand);
}

export function deactivate() { }

function findSchemaLine(document: vscode.TextDocument, modelName: string): number | null {
	const tableName = fn.getTableNameFromModelName(modelName);
	const createTableRegex = new RegExp(`create_table "${tableName}"`);

	for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {
		const line = document.lineAt(lineIndex);
		if (createTableRegex.test(line.text)) {
			return lineIndex;
		}
	}

	return null;
}
