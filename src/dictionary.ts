enum RETURN_CODES {
    // Successful execution
    SUCCESS = 0,
    // All purposes error code
    ERROR = 1,
    // Arithmetic, Calls to undefined, Services, File system or Network errors
    RUNTIME_ERROR = 2,
}

export { RETURN_CODES };
