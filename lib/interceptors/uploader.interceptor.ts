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

      const { file } = req;
      console.log('File:', file);

      const buffer = await readChunk(file.path, { length: 4100 });

      const { ext, mime } = await fromBuffer(buffer);

      console.log('Ext:', ext);
      console.log('Mime:', mime);

      const filename = basename(file.filename, extname(file.filename));
      console.log('filename:', filename);
      console.log('New Filename:', `${filename}.${ext}`);

      return intercept;
    }
  }
  return mixin(Interceptor);
}
