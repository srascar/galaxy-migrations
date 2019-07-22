import { Command } from 'commander';
import execute from '../commands/execute';

const decoratedExecute = (cmd: Command) => execute();

export default decoratedExecute;
