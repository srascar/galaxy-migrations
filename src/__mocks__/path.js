'use strict';

const path = jest.genMockFromModule('path');

function resolve(pathValue) {
    return pathValue;
}

path.resolve = resolve;

module.exports = path;
