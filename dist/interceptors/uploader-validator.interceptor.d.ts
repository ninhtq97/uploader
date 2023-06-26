import { NestInterceptor, Type } from '@nestjs/common';
interface FilesInterceptorOptions {
    acceptMimetype?: Array<string>;
    renameIfMimeWrong?: boolean;
}
export declare function UploaderValidatorInterceptor({ acceptMimetype, renameIfMimeWrong, }: FilesInterceptorOptions): Type<NestInterceptor>;
export {};
