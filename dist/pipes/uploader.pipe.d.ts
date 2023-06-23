/// <reference types="multer" />
import { FileTypeValidatorOptions, FileValidator } from '@nestjs/common';
import { UploaderService } from '../uploader.service';
export declare class UploaderFileTypeValidator extends FileValidator<FileTypeValidatorOptions> {
    private uploaderService;
    constructor(uploaderService: UploaderService, validationOptions: FileTypeValidatorOptions);
    buildErrorMessage(): string;
    isValid<TFile extends Express.Multer.File = any>(file?: TFile): Promise<boolean>;
}
