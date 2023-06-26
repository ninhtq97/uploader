/// <reference types="multer" />
export type UploaderFileTypeValidatorOptions = {
    renameIfMimeWrong?: boolean;
};
export type UploaderFile = {
    acceptMimeType: string[];
} & Express.Multer.File;
