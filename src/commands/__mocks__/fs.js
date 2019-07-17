'use strict';

const fs = jest.genMockFromModule('fs');

let referential = [];

function __setFileReferential(fileReferential) {
    referential = fileReferential;
}

function writeFileSync(path, content, type = 'file') {
    referential.push({
        type,
        path,
        content,
    });
}

function existsSync(path) {
    return referential.filter(value => value.path === path).length > 0;
}

function mkdirSync(path) {
    writeFileSync(path, 'DIRECTORY', 'directory');
}

fs.__setFileReferential = __setFileReferential;
fs.writeFileSync = writeFileSync;
fs.existsSync = existsSync;
fs.mkdirSync = mkdirSync;

module.exports = fs;
