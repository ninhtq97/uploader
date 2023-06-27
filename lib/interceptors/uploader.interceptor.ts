import { Injectable, NestInterceptor, Type, mixin } from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { DiskStorageOptions, diskStorage } from 'multer';
import { MIME_TYPE } from '../constants/uploader.constant';
import { UploaderService } from '../uploader.service';
import {
  convertPath,
  editFileName,
  fileFilter,
  makeDes,
} from '../utils/uploader.util';

interface FilesInterceptorOptions {
  fieldName?: string;
  uploadFields?: MulterField[];
  maxCount?: number;
  path?: string;
  limits?: MulterOptions['limits'];
  acceptMimetype?: Array<string>;
  destination?: DiskStorageOptions['destination'];
  filename?: DiskStorageOptions['filename'];
  renameIfMimeWrong?: boolean;
}

export function UploaderInterceptor({
  fieldName,
  uploadFields,
  maxCount,
  path,
  limits,
  acceptMimetype = Object.values(MIME_TYPE)
    .map((e) => e)
    .flat(),
  destination,
  filename,
  renameIfMimeWrong = true,
}: FilesInterceptorOptions): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;

    constructor(private readonly uploaderService: UploaderService) {
      const filesDest = this.uploaderService.uploaderOptions.dest;

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination:
            destination || makeDes(convertPath(`${filesDest}/${path || ''}`)),
          filename: filename || editFileName,
        }),
        fileFilter: fileFilter(acceptMimetype),
        limits: limits,
      };

      if (uploadFields) {
        this.fileInterceptor = new (FileFieldsInterceptor(
          uploadFields,
          multerOptions,
        ))();
      } else if (maxCount) {
        this.fileInterceptor = new (FilesInterceptor(
          fieldName,
          maxCount,
          multerOptions,
        ))();
      } else {
        this.fileInterceptor = new (FileInterceptor(
          fieldName,
          multerOptions,
        ))();
      }
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}
