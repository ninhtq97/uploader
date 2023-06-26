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
import { MIME_TYPE } from '../constants/uploader.constant';
import { readChunk } from '../utils/uploader.util';

interface FilesInterceptorOptions {
  acceptMimetype?: Array<string>;
  renameIfMimeWrong?: boolean;
}

export function UploaderValidatorInterceptor({
  acceptMimetype = Object.values(MIME_TYPE)
    .map((e) => e)
    .flat(),
  renameIfMimeWrong = true,
}: FilesInterceptorOptions): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler) {
      const ctx = context.switchToHttp();
      const req = ctx.getRequest<Request>();

      const { file } = req;

      const buffer = await readChunk(file.path, { length: 4100 });
      const { ext, mime } = await fromBuffer(buffer);

      if (!acceptMimetype.includes(mime)) {
        console.log('=====================Intercept Throw Error Original Mime');
        await unlink(file.path);
        throw new BadRequestException('Invalid original mime type');
      }

      if (renameIfMimeWrong) {
        console.log('=====================Intercept Rename File If Mime Wrong');
        const name = basename(file.filename, extname(file.filename));
        const filename = `${name}.${ext}`;
        const path = `${file.destination}/${filename}`;

        await rename(file.path, path);
        req.file = { ...file, mimetype: mime, filename, path: path };
      }

      console.log('=====================Intercept Done');
      return next.handle();
    }
  }
  return mixin(Interceptor);
}
