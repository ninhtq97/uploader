"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readChunk = void 0;
const promises_1 = require("fs/promises");
async function readChunk(filePath, { length, startPosition = undefined }) {
    const fileDescriptor = await (0, promises_1.open)(filePath, 'r');
    try {
        const result = await fileDescriptor.read({
            buffer: Buffer.alloc(length),
            length,
            position: startPosition,
        });
        const bytesRead = result.bytesRead;
        let buffer = result.buffer;
        if (bytesRead < length) {
            buffer = buffer.subarray(0, bytesRead);
        }
        return buffer;
    }
    finally {
        await fileDescriptor.close();
    }
}
exports.readChunk = readChunk;
