import { FileTypeValidatorOptions, FileValidator } from '@nestjs/common';

export class UploaderFileTypeValidator extends FileValidator<FileTypeValidatorOptions> {
  buildErrorMessage(): string {
    return `Validation failed (expected type is ${this.validationOptions.fileType})`;
  }

  async isValid<TFile extends Express.Multer.File = any>(
    file?: TFile,
  ): Promise<boolean> {
    if (!this.validationOptions) {
      return true;
    }

    console.log('Pipe File:', file);

    return !!file && 'mimetype' in file;
  }
}
