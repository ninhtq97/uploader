import { FileTypeValidator } from '@nestjs/common';

interface IFile {
  mimetype: string;
  size: number;
}

export class UploaderFileTypeValidator extends FileTypeValidator {
  buildErrorMessage(): string {
    return `Validation failed (expected type is ${this.validationOptions.fileType})`;
  }

  isValid<TFile extends IFile = any>(file?: TFile): boolean {
    if (!this.validationOptions) {
      return true;
    }

    console.log('Pipe File:', file);

    return (
      !!file &&
      'mimetype' in file &&
      !!file.mimetype.match(this.validationOptions.fileType)
    );
  }
}
