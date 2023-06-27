import { FileValidator } from '@nestjs/common';
import { fromBuffer } from 'file-type';
import {
  UploaderFile,
  UploaderFileTypeValidatorOptions,
} from '../interfaces/uploader-validator-options';
import { readChunk } from '../utils/uploader.util';

interface IFile {
  mimetype: string;
  size: number;
}

export class UploaderFileTypeValidator extends FileValidator<UploaderFileTypeValidatorOptions> {
  acceptMimeType: string[];

  constructor({ renameIfMimeWrong = true }: UploaderFileTypeValidatorOptions) {
    super({ renameIfMimeWrong });
  }

  buildErrorMessage(): string {
    return `Validation failed (expected type is ${this.acceptMimeType.join(
      ', ',
    )})`;
  }

  async isValid<TFile extends IFile = any>(file?: TFile) {
    console.log('Pipe File:', file);

    if (!this.validationOptions) return true;

    const parseFile: UploaderFile = file as any;
    this.acceptMimeType = parseFile.acceptMimeType || [];

    const buffer = await readChunk(parseFile.path, { length: 4100 });
    const { ext, mime } = await fromBuffer(buffer);

    // if (this.validationOptions.renameIfMimeWrong) {
    //   const name = basename(parseFile.filename, extname(parseFile.filename));
    //   const filename = `${name}.${ext}`;
    //   const path = `${parseFile.destination}/${filename}`;

    //   await rename(parseFile.path, path);
    //   file = { ...file, mimetype: mime, filename, path: path };
    // }

    return (
      !!file && 'mimetype' in file && parseFile.acceptMimeType.includes(mime)
    );
  }
}
