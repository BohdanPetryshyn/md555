const { Readable } = require('stream');

const toStringStream = require('../../src/utils/toStringStream');

describe('toStringStream', () => {
    test('returns a stream', () => {
        const string = 'test string';

        const stream = toStringStream(string);
        expect(stream).toBeInstanceOf(Readable)
    });

    test('returns a stream that returns a string with one chunk', () => {
        const string = 'test string';
        const expectedChunk = Buffer.from(string, 'utf-8');

        const stream = toStringStream(string);
        expect(stream.read()).toEqual(expectedChunk);
        expect(stream.read()).toBe(null);
    })
});