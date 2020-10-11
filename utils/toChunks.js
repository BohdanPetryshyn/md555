const toChunks = (buffer, size) => {
    if (size <= 0) {
        return [buffer];
    }

    const result = [];
    let nextPosition = 0;

    while (nextPosition < buffer.length) {
        nextPosition += size;
        result.push(buffer.slice(nextPosition - size, nextPosition));
    }

    return result;
}

module.exports = toChunks;