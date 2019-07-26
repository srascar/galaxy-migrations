import { Container } from '@azure/cosmos';
import clientConnector from './clientConnector';
import { SUPPORTED_CONNECTORS } from './dictionary';

test('should an instance of container for azure cosmos db', () => {
    const config = {
        connector: SUPPORTED_CONNECTORS.azure_cosmos_db,
        endpoint: 'https://localhost:443/',
        primaryKey: 'abcd',
        name: 'my_database',
        container: 'my_container',
    };

    const container = clientConnector(config);
    expect(container).toBeInstanceOf(Container);
});

test('should throw an error if connector is not supported', () => {
    const config = {
        connector: 'anything',
        endpoint: 'https://localhost:443/',
        primaryKey: 'abcd',
        name: 'my_database',
        container: 'my_container',
    };

    // @ts-ignore: Unreachable code error
    expect(() => clientConnector(config)).toThrowError(
        'Connector "anything" is not supported'
    );
});
