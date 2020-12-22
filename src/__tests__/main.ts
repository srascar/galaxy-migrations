import { cli } from '../utils';

test('return usage instructions followed by an error code ', async () => {
    const result = await cli([]);
    expect(result.stdout).toBe(`Usage: galaxy-migrations [options] [command]

Options:
  -V, --version                          output the version number
  -v, --verbose                          Output extra debugging
  -c, --config-file <path>               Path to the config file. Default: "migrations_config.yml"
  -h, --help                             display help for command

Commands:
  generate                               Generate a blank migration file
  execute [options] <migration-version>  Execute a specific migration up or down
  migrate [options]                      Execute all migrations in the configured directory
  help [command]                         display help for command
`);
    expect(result.code).toBe(1);
});
