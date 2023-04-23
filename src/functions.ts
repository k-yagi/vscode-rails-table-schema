import * as pluralize from 'pluralize';

// @param {string} relativePath - relative path to the model file
// @example
//   getModelNameFromPath('app/models/user.rb') // => 'User'
export function getModelNameFromPath(relativePath: string): string | null {
  const match = relativePath.match(/app\/models\/(.+)\.rb/);
  if (!match) {
    return null;
  }

  const namespacePath = match[1];
  return namespacePath.split('/').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('::');
}

// @param {string} modelName - rails style model name
// @example
//   getTableNameFromModelName('Admin::User') // => 'admin_users'
export function getTableNameFromModelName(modelName: string): string {
  const parts = modelName.split('::');
  const lastPart = parts.pop();
  if (!lastPart) {
    return '';
  }

  const pluralizedLastPart = pluralize.plural(lastPart);
  parts.push(pluralizedLastPart);

  return parts.join('_').toLowerCase();
}
