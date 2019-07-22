jest.mock('fs');
jest.mock('path');
import * as fs from 'fs';
import { FsEntry } from '../__interfaces__/mockInterfaces';
import configurationLoader from './configurationLoader';

test('should parse the config file and return a valid object', () => {
    const configFile = {
        type: 'file',
        path: 'migrations_config.yml',
        content: `migrations_directory: migrations
database:
    connector: azure_cosmos_db
    endpoint: https://localhost:443/
    primary_key: abcd
    name: my_database
    container: my_container`,
    };
    let fileReferential: Array<FsEntry> = [configFile];
    // @ts-ignore: Unreachable code error
    fs.__setFileReferential(fileReferential);

    const config = configurationLoader();
    expect(config).toEqual({
        database: {
            connector: 'azure_cosmos_db',
            container: 'my_container',
            endpoint: 'https://localhost:443/',
            name: 'my_database',
            primaryKey: 'abcd',
        },
        migrationsDirectory: 'migrations',
    });
});
