/// <reference types="multer" />
import { FileValidator } from '@nestjs/common';
import { UploaderFileTypeValidatorOptions } from '../interfaces/uploader-validator-options';
export declare class UploaderFileTypeValidator extends FileValidator<UploaderFileTypeValidatorOptions> {
    constructor({ acceptMimeType, renameIfMimeWrong, }: UploaderFileTypeValidatorOptions);
    buildErrorMessage(): string;
    isValid(file?: Express.Multer.File): Promise<boolean>;
}
