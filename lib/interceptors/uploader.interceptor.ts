import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
  mixin,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { Request } from 'express';
import { fromBuffer } from 'file-type';
import { rename } from 'fs/promises';
import { DiskStorageOptions, diskStorage } from 'multer';
import { basename, extname } from 'path';
import { MIME_TYPE } from '../constants/uploader.constant';
import { UploaderService } from '../uploader.service';
import {
  convertPath,
  editFileName,
  fileFilter,
  makeDes,
  readChunk,
} from '../utils/uploader.util';

interface FilesInterceptorOptions {
  fieldName?: string;
  uploadFields?: MulterField[];
  maxCount?: number;
  path?: string;
  limits?: MulterOptions['limits'];
  fileFilter?: MulterOptions['fileFilter'];
  destination?: DiskStorageOptions['destination'];
  filename?: DiskStorageOptions['filename'];
  renameIfMimeWrong?: boolean;
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

    async intercept(context: ExecutionContext, next: CallHandler) {
      const ctx = context.switchToHttp();
      const req = ctx.getRequest<Request>();

      const intercept = await this.fileInterceptor.intercept(context, next);

      if (options.renameIfMimeWrong) {
        const { file } = req;

        const buffer = await readChunk(file.path, { length: 4100 });
        const { ext, mime } = await fromBuffer(buffer);

        const name = basename(file.filename, extname(file.filename));
        const filename = `${name}.${ext}`;
        const path = `${file.destination}/${filename}`;

        await rename(file.path, path);
        req.file = { ...file, mimetype: mime, filename, path: path };
      }

      return intercept;
    }
  }
  return mixin(Interceptor);
}
