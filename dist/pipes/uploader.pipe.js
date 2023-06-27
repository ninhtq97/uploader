"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderFileTypeValidator = void 0;
const common_1 = require("@nestjs/common");
const file_type_1 = require("file-type");
const uploader_util_1 = require("../utils/uploader.util");
class UploaderFileTypeValidator extends common_1.FileValidator {
    constructor({ renameIfMimeWrong = true }) {
        super({ renameIfMimeWrong });
    }
    buildErrorMessage() {
        return `Validation failed (expected type is ${this.acceptMimeType.join(', ')})`;
    }
    async isValid(file) {
        console.log('Pipe File:', file);
        if (!this.validationOptions)
            return true;
        const parseFile = file;
        this.acceptMimeType = parseFile.acceptMimeType || [];
        const buffer = await (0, uploader_util_1.readChunk)(parseFile.path, { length: 4100 });
        const { ext, mime } = await (0, file_type_1.fromBuffer)(buffer);
        return (!!file && 'mimetype' in file && parseFile.acceptMimeType.includes(mime));
    }
}
exports.UploaderFileTypeValidator = UploaderFileTypeValidator;
