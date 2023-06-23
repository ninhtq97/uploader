"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderFileTypeValidator = void 0;
const common_1 = require("@nestjs/common");
const file_type_1 = require("file-type");
const uploader_util_1 = require("../utils/uploader.util");
class UploaderFileTypeValidator extends common_1.FileValidator {
    buildErrorMessage() {
        return `Validation failed (expected type is ${this.validationOptions.fileType})`;
    }
    async isValid(file) {
        if (!this.validationOptions) {
            return true;
        }
        console.log('Pipe File:', file);
        const buffer = await (0, uploader_util_1.readChunk)(file.path, { length: 4100 });
        console.log(await (0, file_type_1.fromBuffer)(buffer));
        return !!file && 'mimetype' in file;
    }
}
exports.UploaderFileTypeValidator = UploaderFileTypeValidator;
