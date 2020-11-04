const { Readable } = require('stream');

const toBuffer = str => Buffer.from(str, 'utf-8');

const toStream = str => {
    const buffer = toBuffer(str);
    const readable = new Readable()
    readable._read = () => {}
    readable.push(buffer)
    readable.push(null)

    return readable;
}

module.exports = toStream;