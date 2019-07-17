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

export { cli };
