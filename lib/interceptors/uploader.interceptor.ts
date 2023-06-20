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
import { convertPath, editFileName, fileFilter, makeDes } from '../utils/uploader.util';

interface FilesInterceptorOptions {
  fieldName?: string;
  uploadFields?: MulterField[];
  maxCount?: number;
  path?: string;
  limits?: MulterOptions['limits'];
  fileFilter?: MulterOptions['fileFilter'];
  destination?: DiskStorageOptions['destination'];
  filename?: DiskStorageOptions['filename'];
}

export function UploaderInterceptor(
  options: FilesInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;

    constructor(private readonly uploaderService: UploaderService) {
      const filesDest = this.uploaderService.uploaderOptions.dest;

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination:
            options.destination ||
            makeDes(convertPath(`${filesDest}/${options.path || ''}`)),
          filename: options.filename || editFileName,
        }),
        fileFilter:
          options.fileFilter ||
          fileFilter(
            Object.values(MIME_TYPE)
              .map((e) => e)
              .flat(),
          ),
        limits: options.limits,
      };

      if (options.uploadFields) {
        this.fileInterceptor = new (FileFieldsInterceptor(
          options.uploadFields,
          multerOptions,
        ))();
      } else if (options.maxCount) {
        this.fileInterceptor = new (FilesInterceptor(
          options.fieldName,
          options.maxCount,
          multerOptions,
        ))();
      } else {
        this.fileInterceptor = new (FileInterceptor(
          options.fieldName,
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
