import { NestInterceptor, Type } from '@nestjs/common';
interface ValidatorFilesInterceptorOptions {
    acceptMimetype?: Array<string>;
    renameIfMimeWrong?: boolean;
}
export declare function UploaderValidatorInterceptor({ acceptMimetype, renameIfMimeWrong, }: ValidatorFilesInterceptorOptions): Type<NestInterceptor>;
export {};
