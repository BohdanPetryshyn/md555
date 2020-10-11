const { Transform } = require('stream');

const { rolInt32 } = require('bitwise-rotation');

const toChunks = require('./utils/toChunks');

const EMPTY_BUFFER = Buffer.alloc(0);
const CHUNK_SIZE = 64;
const WORD_SIZE = 4;
const MESSAGE_LENGTH_SIZE = 8;
const PADDING_BUFFER_MIN_SIZE = MESSAGE_LENGTH_SIZE + 1;

const SINUSES = require('./utils/sinuses');
const ROTATES = require('./utils/rotates');

const addInt32 = (num1, num2) => {
    return (num1 + num2) | 0;
}

class Md5HashStream extends Transform {
    constructor() {
        super();
        this.A = 0x67452301 | 0;
        this.B = 0xefcdab89 | 0;
        this.C = 0x98badcfe | 0;
        this.D = 0x10325476 | 0;

        this.originalLength = BigInt(0);
        this.lastSubChunk = EMPTY_BUFFER;
    }

    _transform(chunk, encoding, callback) {
        this.incrementOriginalLength(chunk);

        const chunkWithLastSubChunk = Buffer.concat([this.lastSubChunk, chunk]);

        const subChunks = toChunks(chunkWithLastSubChunk, CHUNK_SIZE);
        this.lastSubChunk = subChunks.pop();

        subChunks.forEach(this.processChunk)

        callback();
    }

    _flush(callback) {
        const paddingBuffer = this.getPaddingBuffer();
        const completedBuffer = Buffer.concat([this.lastSubChunk, paddingBuffer]);

        const subChunks = toChunks(completedBuffer, CHUNK_SIZE);
        subChunks.forEach(this.processChunk);

        this.push(this.getResultBuffer());

        callback();
    }

    incrementOriginalLength(chunk) {
        this.originalLength += BigInt(chunk.length * 8);
    }

    processChunk = (chunk) => {
        const words = toChunks(chunk, WORD_SIZE).map(chunk => chunk.reverse());

        let chunkA = this.A;
        let chunkB = this.B;
        let chunkC = this.C;
        let chunkD = this.D;

        for (let i = 0; i < 64; i++) {
            let fResult;
            let gResult;
            if(0 <= i && i <= 15) {
                fResult = this.f1(chunkB, chunkC, chunkD);
                gResult = this.g1(i);
            } else if (16 <= i && i <= 31) {
                fResult = this.f2(chunkB, chunkC, chunkD);
                gResult = this.g2(i);
            } else if (32 <= i && i <= 47) {
                fResult = this.f3(chunkB, chunkC, chunkD);
                gResult = this.g3(i);
            } else {
                fResult = this.f4(chunkB, chunkC, chunkD);
                gResult = this.g4(i);
            }

            const F = addInt32(addInt32(addInt32(fResult,chunkA), SINUSES[i]),words[gResult].readUInt32BE());
            chunkA = chunkD;
            chunkD = chunkC;
            chunkC = chunkB;
            chunkB = addInt32(chunkB, rolInt32(F, ROTATES[i]));

        }

        this.A = addInt32(this.A, chunkA)
        this.B = addInt32(this.B, chunkB);
        this.C = addInt32(this.C, chunkC);
        this.D = addInt32(this.D, chunkD);
    }

    f1(b, c, d) {
        return ((b & c) | ((~b) & d)) | 0;
    }

    f2(b, c, d) {
        return ((d & b) | ((~d) & c)) | 0;
    }

    f3(b, c, d) {
        return (b ^ c ^ d) | 0;
    }

    f4(b, c, d) {
        return (c ^ (b | (~d))) | 0
    }

    g1(i) {
        return i
    }

    g2(i) {
        return (5 * i + 1) % 16;
    }

    g3(i) {
        return (3 * i + 5) % 16;
    }

    g4(i) {
        return (7 * i) % 16;
    }

    getResultBuffer() {
        const result = Buffer.alloc(16);
        result.writeInt32LE(this.A, 0);
        result.writeInt32LE(this.B, 4);
        result.writeInt32LE(this.C, 8);
        result.writeInt32LE(this.D, 12);
        return result;
    }

    getPaddingBuffer() {
        const minimumPaddingBufferSize = CHUNK_SIZE - (this.lastSubChunk.length % CHUNK_SIZE);
        const paddingBufferSize = minimumPaddingBufferSize < PADDING_BUFFER_MIN_SIZE
            ? minimumPaddingBufferSize + CHUNK_SIZE
            : minimumPaddingBufferSize;
        const paddingBuffer = Buffer.alloc(paddingBufferSize);
        paddingBuffer.writeUInt8(0b10000000);
        paddingBuffer.writeBigUInt64LE(this.originalLength, paddingBufferSize - MESSAGE_LENGTH_SIZE);

        return paddingBuffer;
    }
}

module.exports = Md5HashStream;