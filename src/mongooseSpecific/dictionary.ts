import { MongooseOptions } from 'mongoose';
import { BaseDatabaseConfiguration, SUPPORTED_CONNECTORS } from '../services/dictionary';

const ALLOWED_KEYS = [
    'uri',
    'options'
];

interface DatabaseConfiguration extends BaseDatabaseConfiguration {
    connector: SUPPORTED_CONNECTORS;
    uri: string;
    options: MongooseOptions;
}

export {
    DatabaseConfiguration,
    ALLOWED_KEYS,
};
