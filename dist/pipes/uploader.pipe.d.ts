/// <reference types="multer" />
import { FileValidator } from '@nestjs/common';
import { UploaderFileTypeValidatorOptions } from '../interfaces/uploader-validator-options';
export declare class UploaderFileTypeValidator extends FileValidator<UploaderFileTypeValidatorOptions> {
    constructor({ acceptMimeType, renameIfMimeWrong, }: UploaderFileTypeValidatorOptions);
    buildErrorMessage(): string;
    isValid<TFile extends Express.Multer.File>(file?: TFile): Promise<boolean>;
}
