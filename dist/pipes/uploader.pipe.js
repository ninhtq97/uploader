"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderFileTypeValidator = void 0;
const common_1 = require("@nestjs/common");
const file_type_1 = require("file-type");
const promises_1 = require("fs/promises");
const uploader_util_1 = require("../utils/uploader.util");
class UploaderFileTypeValidator extends common_1.FileValidator {
    buildErrorMessage() {
        return `Validation failed (expected type is ${this.validationOptions.acceptMimeType.join(', ')})`;
    }
    async isValid(file) {
        if (!this.validationOptions) {
            return true;
        }
        const buffer = await (0, uploader_util_1.readChunk)(file.path, { length: 4100 });
        const { mime } = await (0, file_type_1.fromBuffer)(buffer);
        if (!this.validationOptions.acceptMimeType.includes(mime)) {
            await (0, promises_1.unlink)(file.path);
            return false;
        }
        return (!!file &&
            'mimetype' in file &&
            this.validationOptions.acceptMimeType.includes(mime));
    }
}
exports.UploaderFileTypeValidator = UploaderFileTypeValidator;
