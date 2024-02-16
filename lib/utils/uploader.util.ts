import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { mkdir, open, unlink } from 'fs/promises';
import { customAlphabet, urlAlphabet } from 'nanoid';
import { basename, dirname, extname, join, resolve } from 'path';

export type IReadChunkOptions = { length: number; position?: number };

export async function readChunk(filePath: string, options: IReadChunkOptions) {
  const fileDescriptor = await open(filePath, 'r');

  try {
    const result = await fileDescriptor.read({
      buffer: Buffer.alloc(options.length),
      ...options,
    });

    const bytesRead = result.bytesRead;
    let buffer = result.buffer;

    if (bytesRead < options.length) {
      buffer = buffer.subarray(0, bytesRead);
    }

    return buffer;
  } finally {
    await fileDescriptor.close();
  }
}

export const convertPath = (path: string): string => {
  const dirPath = dirname(path)
    .replace(/\W/g, '/')
    .split('/')
    .filter(Boolean)
    .join('/');

  const filename = basename(path);

  return `${dirPath}/${filename}`;
};

export const fileFilter =
  (acceptMimetype: Array<string>) =>
  (
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error, acceptFile: boolean) => void,
  ) => {
    if (!acceptMimetype || !acceptMimetype.includes(file.mimetype)) {
      return callback(new BadRequestException('Invalid mime type'), false);
    }

    callback(null, true);
  };

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error, filename: string) => void,
) => {
  const name = customAlphabet(urlAlphabet)();
  const fileExtName = extname(file.originalname);
  const randomName = Array(6)
    .fill(null)
    .map(() => Math.round(Math.random() * 10).toString(10))
    .join('');

  callback(null, `${name}-${randomName}${fileExtName}`);
};

export const makeDes = (path: string) => {
  return async (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error, destination: string) => void,
  ) => {
    await mkdir(resolve(join('.', path)), { recursive: true });
    cb(null, path);
  };
};

export const removeFiles = async (files: Express.Multer.File[]) => {
  for (const file of files) await unlink(file.path);
  return true;
};
