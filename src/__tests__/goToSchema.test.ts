import { getModelNameFromPath, getTableNameFromModelName } from '../functions';

describe('getModelNameFromPath', () => {
  test('returns correct model name from file path', () => {
    const filePath = '/path/to/workspace/app/models/user.rb';
    expect(getModelNameFromPath(filePath)).toBe('User');
  });

  test('returns correct namespaced model name from file path', () => {
    const filePath = '/path/to/workspace/app/models/admin/user.rb';
    expect(getModelNameFromPath(filePath)).toBe('Admin::User');
  });

  test('returns null if not a model file path', () => {
    const filePath = '/path/to/workspace/app/controllers/users_controller.rb';
    expect(getModelNameFromPath(filePath)).toBeNull();
  });
});

describe('getTableNameFromModelName', () => {
  test('returns correct table name from model name', () => {
    const modelName = 'User';
    expect(getTableNameFromModelName(modelName)).toBe('users');
  });

  test('returns correct table name from namespaced model name', () => {
    const modelName = 'Admin::User';
    expect(getTableNameFromModelName(modelName)).toBe('admin_users');
  });

  test('handles irregular plural nouns', () => {
    const modelName = 'Person';
    expect(getTableNameFromModelName(modelName)).toBe('people');
  });
});
