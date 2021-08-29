
import { connect } from 'mongoose';
import { DatabaseConfiguration } from './dictionary';

const mongooseConector = (
    config: DatabaseConfiguration
): Promise<typeof import('mongoose')> => connect(config.uri, config.options);

export default mongooseConector;