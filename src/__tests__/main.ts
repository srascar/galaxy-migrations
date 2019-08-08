import { cli } from '../utils';

test('return the list of commands when called with no arguments', async () => {
    const result = await cli([]);
    expect(result.stdout).toBe(`Commands:
  generate                               Generate a blank migration file
  execute [options] <migration-version>  Execute a specific migration up or down
  migrate [options]                      Execute all migrations in the configured directory

`);
    expect(result.code).toBe(0);
});
