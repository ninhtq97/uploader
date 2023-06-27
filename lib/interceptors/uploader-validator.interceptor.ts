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
import { unlink } from 'fs/promises';
import { readChunk } from '../utils/uploader.util';

export function UploaderValidatorInterceptor(): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler) {
      const ctx = context.switchToHttp();
      const req = ctx.getRequest<Request>();

      console.log('Uploader Validator Req:', req);

      const acceptMimetype = req.headers['x-accept-mime'];
      const { file } = req;

      const buffer = await readChunk(file.path, { length: 4100 });
      const { mime } = await fromBuffer(buffer);

      // if (renameIfMimeWrong) {
      //   const name = basename(file.filename, extname(file.filename));
      //   const filename = `${name}.${ext}`;
      //   const path = `${file.destination}/${filename}`;

      //   await rename(file.path, path);
      //   req.file = { ...file, mimetype: mime, filename, path: path };
      // }

      if (!acceptMimetype.includes(mime)) {
        await unlink(file.path);
        throw new BadRequestException('Invalid original mime type');
      }

      return next.handle();
    }
  }
  return mixin(Interceptor);
}
