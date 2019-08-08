import { Command } from 'commander';

import configLoader from '../services/configurationLoader';
import clientConnector from '../services/clientConnector';
import execute from '../commands/execute';
import MigrationResolver from '../services/migrationResolver';
import catchableProcess from '../decorators/catchableProcess';

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
