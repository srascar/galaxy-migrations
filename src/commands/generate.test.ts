jest.mock('fs');
jest.mock('path');
import * as fs from 'fs';
import generate from './generate';
import { RETURN_CODES } from '../dictionary';

interface FsEntry {
    type: string;
    path: string;
    content: string;
}

test('should try to create the output directory if not exists, and then generate the migration file', () => {
    let fileReferential: Array<FsEntry> = [];
    // @ts-ignore: Unreachable code error
    fs.__setFileReferential(fileReferential);

    const resultCode = generate();
    // when mkdirSync is called, it would set the value of content to DIRECTORY for a directory
    expect(resultCode).toBe(RETURN_CODES.SUCCESS);
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

    const resultCode = generate(null, 1);
    expect(resultCode).toBe(RETURN_CODES.SUCCESS);
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
     * The query to execute
     */
    query: "SELECT * FROM c;",
    /**
     * Callback to apply on each item during the migration
     *
     * It must return an Object
     */
    up: (itemBody) => itemBody,
    /**
     * Callback to apply on each item during the rollback
     *
     * It must return an Object
     */
    down: (itemBody) => itemBody,
    /**
     * Version number to apply on each item updated by this migration
     */
    versionNumber: 1,
}

module.exports = migration1;
`,
    });
});

test('should generate the migration file with a specific content', () => {
    const createdDirectory = {
        type: 'directory',
        path: 'migrations',
        content: 'Content for this directory should not change',
    };
    const existingFile = {
        type: 'file',
        path: 'migrations/migration1.js',
        content: 'qny file content',
    };
    let fileReferential: Array<FsEntry> = [createdDirectory, existingFile];
    // @ts-ignore: Unreachable code error
    fs.__setFileReferential(fileReferential);

    const resultCode = generate(null, 1);
    expect(resultCode).toBe(RETURN_CODES.RUNTIME_ERROR);
});
