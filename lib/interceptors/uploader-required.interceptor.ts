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

export function UploaderRequiredInterceptor(): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler) {
      const ctx = context.switchToHttp();
      const req = ctx.getRequest<Request>();

      if (!req.file && !req.files) {
        throw new BadRequestException('File not found');
      }

      return next.handle();
    }
  }
  return mixin(Interceptor);
}
