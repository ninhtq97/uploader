import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
  mixin,
} from '@nestjs/common';
import { Request } from 'express';
import { fromBuffer } from 'file-type';
import { rename } from 'fs/promises';
import { basename, extname } from 'path';
import { catchError, throwError } from 'rxjs';
import { UPLOADER_HEADERS } from '../constants/uploader.constant';
import { readChunk, removeFiles } from '../utils/uploader.util';

export function UploaderValidatorInterceptor(): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler) {
      const ctx = context.switchToHttp();
      const req = ctx.getRequest<Request>();

      const acceptMimetype = req.headers[UPLOADER_HEADERS.ACCEPT_MIME];
      const { file, files } = req;

      let arrFiles: Express.Multer.File[] = [];
      if (file) arrFiles = [file];
      if (files) {
        arrFiles = Array.isArray(files) ? files : Object.values(files).flat();
      }

      await this.validateMime(arrFiles, [acceptMimetype].flat());

      return next.handle().pipe(
        catchError(async (err) => {
          await removeFiles(arrFiles);
          return throwError(() => err);
        }),
      );
    }

    private async validateMime(
      files: Express.Multer.File[],
      acceptMimetype: string[],
    ) {
      for (const file of files) {
        const buffer = await readChunk(file.path, { length: 4100 });
        const { ext, mime } = await fromBuffer(buffer);

        if (!acceptMimetype.includes(mime)) {
          await removeFiles(files);
          throw new BadRequestException('Invalid original mime type');
        }

        const name = basename(file.filename, extname(file.filename));
        const filename = `${name}.${ext}`;
        const path = `${file.destination}/${filename}`;

        await rename(file.path, path);
        file.mimetype = mime;
        file.filename = filename;
        file.path = path;
      }
    }
  }
  return mixin(Interceptor);
}
