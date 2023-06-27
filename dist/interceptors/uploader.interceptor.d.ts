import { NestInterceptor, Type } from '@nestjs/common';
import { MulterField, MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { DiskStorageOptions } from 'multer';
interface FilesInterceptorOptions {
    fieldName?: string;
    uploadFields?: MulterField[];
    maxCount?: number;
    path?: string;
    limits?: MulterOptions['limits'];
    acceptMimetype?: Array<string>;
    destination?: DiskStorageOptions['destination'];
    filename?: DiskStorageOptions['filename'];
    renameIfMimeWrong?: boolean;
}
export declare function UploaderInterceptor({ fieldName, uploadFields, maxCount, path, limits, acceptMimetype, destination, filename, }: FilesInterceptorOptions): Type<NestInterceptor>;
export {};
