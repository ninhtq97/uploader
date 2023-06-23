/// <reference types="multer" />
import { FileTypeValidatorOptions, FileValidator } from '@nestjs/common';
export declare class UploaderFileTypeValidator extends FileValidator<FileTypeValidatorOptions> {
    buildErrorMessage(): string;
    isValid<TFile extends Express.Multer.File = any>(file?: TFile): Promise<boolean>;
}
