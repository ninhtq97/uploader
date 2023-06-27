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
import { UPLOADER_HEADERS } from '../constants/uploader.constant';
import { readChunk } from '../utils/uploader.util';

export function UploaderValidatorInterceptor(): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler) {
      const ctx = context.switchToHttp();
      const req = ctx.getRequest<Request>();

      const acceptMimetype = req.headers[UPLOADER_HEADERS.ACCEPT_MIME];
      const { file } = req;

      const buffer = await readChunk(file.path, { length: 4100 });
      const { mime } = await fromBuffer(buffer);

      if (!acceptMimetype.includes(mime)) {
        await unlink(file.path);
        throw new BadRequestException('Invalid original mime type');
      }

      return next.handle();
    }
  }
  return mixin(Interceptor);
}
