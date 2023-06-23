import { FileTypeValidatorOptions, FileValidator } from '@nestjs/common';
import { fileTypeFromStream } from 'file-type';
import { UploaderService } from '../uploader.service';

export class UploaderFileTypeValidator extends FileValidator<FileTypeValidatorOptions> {
  constructor(
    private uploaderService: UploaderService,
    validationOptions: FileTypeValidatorOptions,
  ) {
    super(validationOptions);
  }

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
    const stream = await this.uploaderService.getStream(file.path);

    const { ext, mime } = await fileTypeFromStream(stream);

    console.log('Ext:', ext);
    console.log('Mime:', mime);

    return (
      !!file &&
      'mimetype' in file &&
      !!mime.match(this.validationOptions.fileType)
    );
  }
}
