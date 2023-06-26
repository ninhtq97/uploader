/// <reference types="multer" />
import { FileValidator } from '@nestjs/common';
import { UploaderFileTypeValidatorOptions } from '../interfaces/uploader-validator-options';
interface IFile extends Express.Multer.File {
    mimetype: string;
    size: number;
}
export declare class UploaderFileTypeValidator extends FileValidator<UploaderFileTypeValidatorOptions> {
    constructor({ acceptMimeType, renameIfMimeWrong, }: UploaderFileTypeValidatorOptions);
    buildErrorMessage(): string;
    isValid<TFile extends IFile = any>(file?: TFile): Promise<boolean>;
}
export {};
