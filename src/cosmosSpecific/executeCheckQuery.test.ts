import * as cosmos from '@azure/cosmos';
import executeCheckQuery from './executeCheckQuery';

jest.mock('@azure/cosmos');

test('should return a number when the result is a single number in an array', async () => {
    const container = new cosmos.Container(null, 'id', null);
    // @ts-ignore: Unreachable code error
    cosmos.__setNextResponse([100]);
    expect(await executeCheckQuery(container, 'foo', {})).toBe(100);
});

test('should throw an exception in any other case', async () => {
    const container = new cosmos.Container(null, 'id', null);
    // @ts-ignore: Unreachable code error
    cosmos.__setNextResponse({});
    let error;
    try {
        await executeCheckQuery(container, 'foo', {});
    } catch (e) {
        error = e;
    }
    expect(error).toEqual(
        new Error(
            'A valid check query must return a unique number. Recieved [object Object]'
        )
    );

    // @ts-ignore: Unreachable code error
    cosmos.__setNextResponse([123, 456]);
    error = null;
    try {
        await executeCheckQuery(container, 'foo', {});
    } catch (e) {
        error = e;
    }
    expect(error).toEqual(
        new Error(
            'A valid check query must return a unique number. Recieved 123,456'
        )
    );
});
