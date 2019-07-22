import { Command } from 'commander';
import generate from '../commands/generate';

const decoratedGenerate = (cmd: Command) => generate(cmd.outputDir);

export default decoratedGenerate;
