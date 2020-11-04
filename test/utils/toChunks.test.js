const toChunks = require('../../src/utils/toChunks');

describe('toChunks', () => {
    test('correctly splits buffer of 3 chunk sizes', () => {
        const buffer = Buffer.from([1, 2, 3, 4, 5, 6]);
        const chunkSize = 2;
        const expectedSubChunks = [Buffer.from([1, 2],), Buffer.from([3, 4]), Buffer.from([5, 6])];

        expect(toChunks(buffer, chunkSize)).toEqual(expectedSubChunks);
    })

    test('correctly splits buffer of 1 chunk size', () => {
        const buffer = Buffer.from([1, 2]);
        const chunkSize = 2;
        const expectedSubChunks = [Buffer.from([1, 2])];

        expect(toChunks(buffer, chunkSize)).toEqual(expectedSubChunks);
    })

    test("correctly splits buffer that can't be divided evenly", () => {
        const buffer = Buffer.from([1, 2, 3, 4, 5]);
        const chunkSize = 2;
        const expectedSubChunks = [Buffer.from([1, 2]), Buffer.from([3, 4]), Buffer.from([5])];

        expect(toChunks(buffer, chunkSize)).toEqual(expectedSubChunks);
    })

    test('correctly splits empty buffer', () => {
        const buffer = Buffer.from([]);
        const chunkSize = 2;
        const expectedSubChunks = [];

        expect(toChunks(buffer, chunkSize)).toEqual(expectedSubChunks);
    })

    test('throws if the size is equal to 0', () => {
        const buffer = Buffer.from([1, 2]);
        const chunkSize = 0;

        expect(() => toChunks(buffer, chunkSize)).toThrow();
    })

    test('throws if the size is less than 0', () => {
        const buffer = Buffer.from([1, 2]);
        const chunkSize = -1;

        expect(() => toChunks(buffer, chunkSize)).toThrow();
    })

})
