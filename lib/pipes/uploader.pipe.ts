import { FileValidator } from '@nestjs/common';
import { fromBuffer } from 'file-type';
import { rename, unlink } from 'fs/promises';
import { basename, extname } from 'path';
import { MIME_TYPE } from '../constants/uploader.constant';
import { UploaderFileTypeValidatorOptions } from '../interfaces/uploader-validator-options';
import { readChunk } from '../utils/uploader.util';

interface IFile {
  mimetype: string;
  size: number;
}

export class UploaderFileTypeValidator extends FileValidator<UploaderFileTypeValidatorOptions> {
  constructor({
    acceptMimeType = Object.values(MIME_TYPE)
      .map((e) => e)
      .flat(),
    renameIfMimeWrong = true,
  }: UploaderFileTypeValidatorOptions) {
    super({ acceptMimeType, renameIfMimeWrong });
  }

  buildErrorMessage(): string {
    return `Validation failed (expected type is ${this.validationOptions.acceptMimeType.join(
      ', ',
    )})`;
  }

  async isValid<TFile extends IFile = any>(file?: TFile) {
    if (!this.validationOptions) {
      return true;
    }

    const parseFile: Express.Multer.File = file as any;

    const buffer = await readChunk(parseFile.path, { length: 4100 });
    const { ext, mime } = await fromBuffer(buffer);

    if (!this.validationOptions.acceptMimeType.includes(mime)) {
      await unlink(parseFile.path);
      return false;
    }

    if (this.validationOptions.renameIfMimeWrong) {
      console.log('=====================Intercept Rename File If Mime Wrong');
      const name = basename(parseFile.filename, extname(parseFile.filename));
      const filename = `${name}.${ext}`;
      const path = `${parseFile.destination}/${filename}`;

      await rename(parseFile.path, path);
      file = { ...file, mimetype: mime, filename, path: path };
    }

    return (
      !!file &&
      'mimetype' in file &&
      this.validationOptions.acceptMimeType.includes(mime)
    );
  }
}
