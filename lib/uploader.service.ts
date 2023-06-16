import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ReadStream,
  constants,
  createReadStream,
  promises as fsPromises,
} from 'fs';
import { UPLOADER_OPTIONS } from './constants/uploader.constant';
import { UploaderOptions } from './interfaces/uploader-options';
import { convertPath } from './utils/uploader.util';

@Injectable()
export class UploaderService {
  constructor(
    @Inject(UPLOADER_OPTIONS) public uploaderOptions: UploaderOptions,
  ) {}

  getAbsPath(path: string): string {
    return convertPath(`${this.uploaderOptions.dest}/${path}`);
  }

  async accessFile(path: string) {
    try {
      await fsPromises.access(path, constants.R_OK);
    } catch (exception) {
      throw new NotFoundException();
    }

    return true;
  }

  async getStream(path: string): Promise<ReadStream> {
    const standardPath = this.getAbsPath(path);

    await this.accessFile(standardPath);
    return createReadStream(standardPath, { autoClose: true });
  }
}
