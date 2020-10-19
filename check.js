const fs = require('fs');

const Md5HashStream = require('./utils/Md5HashStream');

const hashesEqual = (hash1, hash2) => hash1.toLowerCase() === hash2.toLowerCase();

const executeCheckCommand = argv => {
    const inputFileName = argv._[1];
    const expectedHash = String(argv['e']);

    fs.createReadStream(inputFileName)
        .pipe(new Md5HashStream())
        .on('data', data => {
            const hash = data.toString('hex');
            console.log(hash);

            hashesEqual(hash, expectedHash)
                ? console.log('Hashes are SUPER-EQUAL.')
                : console.log('Hashes are not equal.')
        });
}

module.exports = executeCheckCommand;