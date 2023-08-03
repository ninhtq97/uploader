import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UploaderRequiredInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>();

    if (!req.file && !req.files) {
      throw new BadRequestException('File not found');
    }

    return next.handle();
  }
}
