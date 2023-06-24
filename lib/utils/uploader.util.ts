import { Request } from 'express';
import { promises as fsPromises } from 'fs';
import { customAlphabet, urlAlphabet } from 'nanoid';
import { basename, dirname, extname, join, resolve } from 'path';

import { BadRequestException } from '@nestjs/common';
import { open } from 'fs/promises';

export async function readChunk(
  filePath: string,
  { length, startPosition = undefined },
) {
  const fileDescriptor = await open(filePath, 'r');

  try {
    const result = await fileDescriptor.read({
      buffer: Buffer.alloc(length),
      length,
      position: startPosition,
    });

    const bytesRead = result.bytesRead;
    let buffer = result.buffer;

    if (bytesRead < length) {
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
    console.log('====================Run File Filter...');

    if (!acceptMimetype || !acceptMimetype.includes(file.mimetype)) {
      console.log('====================File Filter Callback False');
      callback(new BadRequestException('Invalid mime type'), false);
    }

    console.log('====================File Filter Callback True');
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
    await fsPromises.mkdir(resolve(join('.', path)), { recursive: true });
    cb(null, path);
  };
};
