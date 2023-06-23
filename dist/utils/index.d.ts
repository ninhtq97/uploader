/// <reference types="node" />
export declare function readChunk(filePath: string, { length, startPosition }: {
    length: any;
    startPosition?: any;
}): Promise<Buffer>;
