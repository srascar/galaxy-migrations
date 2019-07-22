import { resolve as pathResolve } from 'path';
import { exec, ExecException } from 'child_process';

interface Result {
    code: number;
    error: ExecException;
    stdout: string;
    stderr: string;
}

const cli = (args: string[], cwd: string = '.'): Promise<Result> =>
    new Promise(resolve => {
        exec(
            `node ${pathResolve('galaxy-migrations')} ${args.join(' ')}`,
            { cwd },
            (error, stdout, stderr) => {
                resolve({
                    code: error && error.code ? error.code : 0,
                    error,
                    stdout,
                    stderr,
                });
            }
        );
    });

const snakeToCamelCase = (string: string): string => {
    return string
        .replace(/_(.)/g, function($1) {
            return $1.toUpperCase();
        })
        .replace(/_/g, '')
        .replace(/^(.)/, function($1) {
            return $1.toLowerCase();
        });
};

const traverseKeysRecursively = <T>(
    object: T,
    cb: (key: string) => string
): T => {
    // @ts-ignore: Unreachable code error
    return Object.fromEntries(
        Object.entries(object).map(entry => {
            const newEntry = [];
            newEntry[0] = cb(entry[0]);
            newEntry[1] = entry[1];
            if (typeof entry[1] === 'object') {
                newEntry[1] = traverseKeysRecursively(entry[1], cb);
            }

            return newEntry;
        })
    );
};

export { cli, snakeToCamelCase, traverseKeysRecursively };
