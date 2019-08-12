import { Command } from 'commander';

import execute from '../commands/execute';
import catchableProcess from '../decorators/catchableProcess';
import clientConnector from '../services/clientConnector';
import configLoader from '../services/configurationLoader';
import MigrationResolver from '../services/migrationResolver';

const decoratedExecute = async (cmd: Command) => {
    const config = configLoader(cmd.configFile);
    const container = clientConnector(config.database);
    const migrationDir = MigrationResolver.getMigrationDir(
        config.migrationsDir
    );
    const migrationFiles = MigrationResolver.readMigrationDir(migrationDir);
    await Promise.all(
        migrationFiles.map(migrationFile => {
            const migration = MigrationResolver.getMigration(
                `${migrationDir}/${migrationFile}`
            );
            return execute(
                container,
                migration,
                cmd.way,
                cmd.dryRun,
                cmd.parent.verbose
            );
        })
    );
};

export default catchableProcess(decoratedExecute);
