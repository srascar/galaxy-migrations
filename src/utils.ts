import { exec, ExecException } from 'child_process';
import { resolve as pathResolve } from 'path';

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

const snakeToCamelCase = (input: string): string => {
    return input
        .replace(/_(.)/g, $1 => {
            return $1.toUpperCase();
        })
        .replace(/_/g, '')
        .replace(/^(.)/, $1 => {
            return $1.toLowerCase();
        });
};

const traverseKeysRecursively = <T>(
    object: T,
    cb: (key: string) => string
): T => {
    return Object.entries(object)
        .map(entry => {
            const newEntry = [];
            newEntry[0] = cb(entry[0]);
            newEntry[1] = entry[1];
            if (typeof entry[1] === 'object') {
                newEntry[1] = traverseKeysRecursively(entry[1], cb);
            }

            return newEntry;
        })
        .reduce(
            (result: any, entry: string[]) => {
                result[entry[0]] = entry[1];
                return result;
            },
            {} as T
        );
};

function pad(integer: number) {
    if (integer < 10) {
        return '0' + integer;
    }
    return integer;
}

export { cli, snakeToCamelCase, traverseKeysRecursively, pad };
