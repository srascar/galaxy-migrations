import { cli } from '../utils';

test('return the list of commands when called with no arguments', async () => {
    const result = await cli([]);
    expect(result.stdout).toBe(`Commands:
  generate [options]  Generate a blank migration file
  execute             Execute a specific migration up or down

`);
    expect(result.code).toBe(0);
});
