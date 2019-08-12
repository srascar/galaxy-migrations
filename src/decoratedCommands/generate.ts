import { Command } from 'commander';

import generate from '../commands/generate';
import catchableProcess from '../decorators/catchableProcess';
import configLoader from '../services/configurationLoader';
import MigrationResolver from '../services/migrationResolver';

const decoratedGenerate = (cmd: Command) => {
    const config = configLoader(cmd.parent.configFile);
    const migrationDir = MigrationResolver.getMigrationDir(
        config.migrationsDir
    );
    const versionNumber = MigrationResolver.generateVersionNumber();
    const filePath = MigrationResolver.getMigrationPath(
        migrationDir,
        versionNumber
    );
    generate(migrationDir, filePath, versionNumber);
};

export default catchableProcess(decoratedGenerate);
