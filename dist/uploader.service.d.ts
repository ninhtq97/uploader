/// <reference types="node" />
import { ReadStream } from 'fs';
import { UploaderOptions } from './interfaces/uploader-options';
export declare class UploaderService {
    uploaderOptions: UploaderOptions;
    constructor(uploaderOptions: UploaderOptions);
    getAbsPath(path: string): string;
    accessFile(path: string): Promise<boolean>;
    getStream(path: string): Promise<ReadStream>;
}
