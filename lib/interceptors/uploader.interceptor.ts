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
import { DiskStorageOptions, diskStorage } from 'multer';
import { MIME_TYPE, UPLOADER_HEADERS } from '../constants/uploader.constant';
import { UploaderService } from '../uploader.service';
import {
  convertPath,
  editFileName,
  fileFilter,
  makeDes,
} from '../utils/uploader.util';

interface FilesInterceptorOptions {
  fieldName?: string;
  fields?: MulterField[];
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
  fields,
  maxCount,
  path,
  limits,
  acceptMimetype = Object.values(MIME_TYPE)
    .map((e) => e)
    .flat(),
  destination,
  filename,
}: FilesInterceptorOptions): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fI: NestInterceptor;

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

      if (fields) {
        this.fI = new (FileFieldsInterceptor(fields, multerOptions))();
      } else if (maxCount) {
        this.fI = new (FilesInterceptor(fieldName, maxCount, multerOptions))();
      } else {
        this.fI = new (FileInterceptor(fieldName, multerOptions))();
      }
    }

    intercept(context: ExecutionContext, next: CallHandler) {
      const ctx = context.switchToHttp();
      const req = ctx.getRequest<Request>();

      req.headers[UPLOADER_HEADERS.ACCEPT_MIME] = acceptMimetype;
      return this.fI.intercept(context, next);
    }
  }
  return mixin(Interceptor);
}
