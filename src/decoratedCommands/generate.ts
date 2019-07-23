import { Command } from 'commander';
import configLoader from '../services/configurationLoader';
import generate from '../commands/generate';

const decoratedGenerate = (cmd: Command) => {
    const config = configLoader(cmd.parent.configFile);
    generate(config.migrationsDir);
};

export default decoratedGenerate;
