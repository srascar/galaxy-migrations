import { Command } from 'commander';
import configLoader from '../services/configurationLoader';
import clientConnector from '../services/clientConnector';
import execute from '../commands/execute';

const decoratedExecute = (cmd: Command) => {
    const config = configLoader(cmd.configFile);
    const connection = clientConnector(config.database);
    execute(connection, cmd.migrationVersion, cmd.way);
};

export default decoratedExecute;
