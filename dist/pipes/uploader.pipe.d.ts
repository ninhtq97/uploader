import { FileTypeValidator } from '@nestjs/common';
interface IFile {
    mimetype: string;
    size: number;
}
export declare class UploaderFileTypeValidator extends FileTypeValidator {
    buildErrorMessage(): string;
    isValid<TFile extends IFile = any>(file?: TFile): boolean;
}
export {};
