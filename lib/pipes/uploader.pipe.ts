import { FileTypeValidatorOptions, FileValidator } from '@nestjs/common';
import { fromBuffer } from 'file-type';
import { readChunk } from '../utils/uploader.util';

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
    const buffer = await readChunk(file.path, { length: 4100 });

    console.log(await fromBuffer(buffer));

    return !!file && 'mimetype' in file;
  }
}
