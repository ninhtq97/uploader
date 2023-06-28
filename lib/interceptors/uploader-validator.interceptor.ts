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
import { rename, unlink } from 'fs/promises';
import { basename, extname } from 'path';
import { UPLOADER_HEADERS } from '../constants/uploader.constant';
import { readChunk } from '../utils/uploader.util';

export function UploaderValidatorInterceptor(): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler) {
      const ctx = context.switchToHttp();
      const req = ctx.getRequest<Request>();

      const acceptMimetype = req.headers[UPLOADER_HEADERS.ACCEPT_MIME];
      const { file, files } = req;

      if (file) {
        await this.validateMime([file], [acceptMimetype].flat());
      }

      if (files) {
        if (Array.isArray(files)) {
          await this.validateMime(files, [acceptMimetype].flat());
        } else {
          await this.validateMime(
            Object.values(files).flat(),
            [acceptMimetype].flat(),
          );
        }
      }

      return next.handle();
    }

    private async validateMime(
      files: Express.Multer.File[],
      acceptMimetype: string[],
    ) {
      for (const file of files) {
        const buffer = await readChunk(file.path, { length: 4100 });
        const { ext, mime } = await fromBuffer(buffer);

        if (!acceptMimetype.includes(mime)) {
          for (const file of files) {
            await unlink(file.path);
          }

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
