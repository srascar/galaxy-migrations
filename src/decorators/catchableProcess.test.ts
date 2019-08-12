import catchableProcess from './catchableProcess';

test('should exit the process if an exception is thrown', async () => {
    // @ts-ignore: Unreachable code error
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const consoleLog = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
    const error = new Error('error 1');

    const command = () => {
        throw error;
    };

    await catchableProcess(command)();
    expect(mockExit).toBeCalledWith(1);
    expect(consoleLog).toBeCalledWith(error);
});

test('should exit the process if an exception is thrown within a promise', async () => {
    // @ts-ignore: Unreachable code error
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const consoleLog = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
    const error = new Error('error 1');

    const command = (): Promise<void> => {
        return new Promise(resolve => {
            throw error;
        });
    };

    await catchableProcess(command)();
    expect(mockExit).toBeCalledWith(1);
    expect(consoleLog).toBeCalledWith(error);
});
