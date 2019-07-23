import { Command } from 'commander';

import configLoader from '../services/configurationLoader';
import clientConnector from '../services/clientConnector';
import execute from '../commands/execute';
import MigrationResolver from '../services/migrationResolver';

const decoratedExecute = (cmd: Command) => {
    const config = configLoader(cmd.configFile);
    const connection = clientConnector(config.database);
    const migrationDir = MigrationResolver.getMigrationDir(
        config.migrationsDir
    );
    const migration = MigrationResolver.getMigration(
        MigrationResolver.getMigrationPath(migrationDir, cmd.migrationVersion)
    );
    execute(connection, migration, cmd.way, cmd.dryRun, cmd.parent.verbose);
};

export default decoratedExecute;
