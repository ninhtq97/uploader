import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { promises as fsPromises } from 'fs';
import { customAlphabet, urlAlphabet } from 'nanoid';
import { basename, dirname, extname, join, resolve } from 'path';

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
  async (
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
    await fsPromises.mkdir(resolve(join('.', path)), { recursive: true });
    cb(null, path);
  };
};
