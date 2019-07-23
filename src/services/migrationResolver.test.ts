import MigrationResolver from './migrationResolver';
jest.mock('path');

describe('getMigrationDir', () => {
    test('should return a default value if nothing is passed', () => {
        expect(MigrationResolver.getMigrationDir()).toBe('migrations');
    });
    test('should return a resolved passed if argument is given', () => {
        expect(MigrationResolver.getMigrationDir('some/path/here')).toBe(
            'some/path/here'
        );
    });
});

describe('generateVersionNumber', () => {
    test('should return 14 digit', () => {
        expect(MigrationResolver.generateVersionNumber().toString()).toMatch(
            /\d{14}/
        );
    });
});

describe('getMigrationPath', () => {
    test('should resolve the migrationDir if none given and compute the migration file name', () => {
        expect(MigrationResolver.getMigrationPath(null, 1)).toBe(
            'migrations/migration1.js'
        );
    });
    test('should resolve the migrationDir and compute the migration file name', () => {
        expect(MigrationResolver.getMigrationPath('some/path/', 1)).toBe(
            'some/path/migration1.js'
        );
    });
});

describe('getMigration', () => {
    test('should return a migration from a file path', () => {
        expect(
            MigrationResolver.getMigration('./__mocks__/fake_migration.js')
        ).toEqual({});
    });
    test('should throw an exception in case of invalid path', () => {
        expect(() => MigrationResolver.getMigration('fake')).toThrowError(
            'Error: An error occured when trying to get migration "fake"'
        );
    });
});
