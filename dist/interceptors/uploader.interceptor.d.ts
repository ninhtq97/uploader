import { NestInterceptor, Type } from '@nestjs/common';
import { MulterField, MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { DiskStorageOptions } from 'multer';
interface FilesInterceptorOptions {
    fieldName?: string;
    uploadFields?: MulterField[];
    maxCount?: number;
    path?: string;
    limits?: MulterOptions['limits'];
    fileFilter?: MulterOptions['fileFilter'];
    destination?: DiskStorageOptions['destination'];
    filename?: DiskStorageOptions['filename'];
    renameIfMimeWrong?: boolean;
}
export declare function UploaderInterceptor(options: FilesInterceptorOptions): Type<NestInterceptor>;
export {};
