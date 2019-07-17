import { Command, Option } from 'commander';
import generate from '../commands/generate';

const decoratedGenerate = (cmd: Command, options: { outputDir?: string }) =>
    process.exit(
        options && options.outputDir ? generate(options.outputDir) : generate()
    );

export default decoratedGenerate;
