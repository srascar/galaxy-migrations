jest.mock('fs');
jest.mock('path');
import * as fs from 'fs';
import { FsEntry } from '../__interfaces__/mockInterfaces';
import generate from './generate';
import MigrationResolver from '../services/migrationResolver';

test('should try to create the output directory if not exists, and then generate the migration file', () => {
    let fileReferential: Array<FsEntry> = [];
    // @ts-ignore: Unreachable code error
    fs.__setFileReferential(fileReferential);
    const migrationDir = MigrationResolver.getMigrationDir();
    const versionNumber = MigrationResolver.generateVersionNumber();
    const filePath = MigrationResolver.getMigrationPath(
        migrationDir,
        versionNumber
    );

    generate(migrationDir, filePath, versionNumber);
    // when mkdirSync is called, it would set the value of content to DIRECTORY for a directory
    expect(fileReferential.length).toBe(2);
    expect(fileReferential[0]).toEqual({
        type: 'directory',
        path: 'migrations',
        content: 'DIRECTORY',
    });
    expect(fileReferential[1]).toMatchObject({
        type: 'file',
        path: expect.stringMatching(/^migrations\/migration\d{14}\.js$/),
        content: expect.stringContaining(
            'This file is auto generated by galaxy-migrations'
        ),
    });
});

test('should generate the migration file with a specific content', () => {
    const createdDirectory = {
        type: 'directory',
        path: 'migrations',
        content: 'Content for this directory should not change',
    };
    let fileReferential: Array<FsEntry> = [createdDirectory];
    // @ts-ignore: Unreachable code error
    fs.__setFileReferential(fileReferential);
    const migrationDir = MigrationResolver.getMigrationDir();
    const versionNumber = 1;
    const filePath = MigrationResolver.getMigrationPath(
        migrationDir,
        versionNumber
    );
    generate(migrationDir, filePath, versionNumber);
    // when mkdirSync is called, it would set the value of content to DIRECTORY for a directory
    expect(fileReferential.length).toBe(2);
    expect(fileReferential[0]).toEqual(createdDirectory);
    // Since we force the version number, we can check the exact content of the file
    expect(fileReferential[1]).toMatchObject({
        type: 'file',
        path: 'migrations/migration1.js',
        content: `/**
 * This file is auto generated by galaxy-migrations
 */

const migration1 = {
    /**
     * This query is executed before the up query.
     * It MUST return a single count.
     * If the count is 0, then the migration doesn't need to be played.
     *
     * Set this value to null to force the execution of the migration.
     */
    checkQueryUp: 'SELECT VALUE count(1) FROM c WHERE NOT is_defined(c._migrationVersion) OR c._migrationVersion < 1',
    /**
     * The query to execute on the way up
     */
    queryUp: 'SELECT * FROM c',
    /**
     * Callback to apply on each item during the migration
     *
     * It must return an Object
     */
    up: (itemBody) => itemBody,

    /**
     * This query is executed before the down query.
     * It MUST return a single count.
     * If the count is 0, then the migration doesn't need to be played.
     *
     * Set this value to null to force the execution of the migration.
     */
    checkQueryDown: 'SELECT VALUE count(1) FROM c WHERE NOT is_defined(c._migrationVersion) OR c._migrationVersion > 1',
    /**
     * The query to execute on the way down
     */
    queryDown: 'SELECT * FROM c',
    /**
     * Callback to apply on each item during the rollback
     *
     * It must return an Object
     */
    down: (itemBody) => itemBody,
    /**
     * Options to pass the the queries
     * ex: { enableCrossPartitionQuery: true }
     */
    queryOptions: {},

    /**
     * Version number to apply on each item updated by this migration
     */
    versionNumber: 1,
    /**
     * Information about the documents that are being transformed
     */
    documentMeta: { idField: 'id', partitionKey: 'id' },
}

module.exports = migration1;
`,
    });
});

test('should raise an exception if the file exists', () => {
    const createdDirectory = {
        type: 'directory',
        path: 'migrations',
        content: 'Content for this directory should not change',
    };
    const existingFile = {
        type: 'file',
        path: 'migrations/migration1.js',
        content: 'any file content',
    };
    let fileReferential: Array<FsEntry> = [createdDirectory, existingFile];
    // @ts-ignore: Unreachable code error
    fs.__setFileReferential(fileReferential);
    const migrationDir = MigrationResolver.getMigrationDir();
    const versionNumber = 1;
    const filePath = MigrationResolver.getMigrationPath(
        migrationDir,
        versionNumber
    );
    expect(() => generate(migrationDir, filePath, versionNumber)).toThrowError(
        'File "migrations/migration1.js" already exists.'
    );
});
