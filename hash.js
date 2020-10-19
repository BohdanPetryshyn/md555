const fs = require('fs');

const toStream = require('./utils/stringStream');
const Md5HashStream = require('./utils/Md5HashStream');

const executeHashCommand = argv => {
    const inputFileName = argv['i'];
    const input = String(argv._[1]);
    const outputFileName = argv['o'];

    const inputStream = inputFileName ? fs.createReadStream(inputFileName) : toStream(input);

    inputStream
        .pipe(new Md5HashStream())
        .on('data', data => {
            const hash = data.toString('hex');
            console.log(hash);

            if (outputFileName) {
                fs.writeFileSync(outputFileName, hash);
            }
        })
}

module.exports = executeHashCommand;