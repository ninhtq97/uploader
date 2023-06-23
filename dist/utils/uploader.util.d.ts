/// <reference types="node" />
/// <reference types="express-serve-static-core" />
/// <reference types="multer" />
import { Request } from 'express';
export declare function readChunk(filePath: string, { length, startPosition }: {
    length: any;
    startPosition?: any;
}): Promise<Buffer>;
export declare const convertPath: (path: string) => string;
export declare const fileFilter: (acceptMimetype: Array<string>) => (req: Request, file: Express.Multer.File, callback: (error: Error, acceptFile: boolean) => void) => void;
export declare const editFileName: (req: Request, file: Express.Multer.File, callback: (error: Error, filename: string) => void) => void;
export declare const makeDes: (path: string) => (req: Request, file: Express.Multer.File, cb: (error: Error, destination: string) => void) => Promise<void>;
