import { FileValidator } from '@nestjs/common';
import { fromBuffer } from 'file-type';
import { unlink } from 'fs/promises';
import { UploaderFileTypeValidatorOptions } from '../interfaces/uploader-validator-options';
import { readChunk } from '../utils/uploader.util';

export class UploaderFileTypeValidator extends FileValidator<UploaderFileTypeValidatorOptions> {
  buildErrorMessage(): string {
    return `Validation failed (expected type is ${this.validationOptions.acceptMimeType.join(
      ', ',
    )})`;
  }

  async isValid<TFile extends Express.Multer.File = any>(
    file?: TFile,
  ): Promise<boolean> {
    if (!this.validationOptions) {
      return true;
    }

    const buffer = await readChunk(file.path, { length: 4100 });
    const { mime } = await fromBuffer(buffer);

    if (!this.validationOptions.acceptMimeType.includes(mime)) {
      await unlink(file.path);
      return false;
    }

    return (
      !!file &&
      'mimetype' in file &&
      this.validationOptions.acceptMimeType.includes(mime)
    );
  }
}
