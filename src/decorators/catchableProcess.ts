const catchableProcess = (
    command: (...args: any[]) => Promise<void> | void
) => async (...args: any[]) => {
    try {
        await command.call(this, ...args);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

export default catchableProcess;
