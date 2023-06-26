"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderFileTypeValidator = void 0;
const common_1 = require("@nestjs/common");
const uploader_constant_1 = require("../constants/uploader.constant");
class UploaderFileTypeValidator extends common_1.FileValidator {
    constructor({ acceptMimeType = Object.values(uploader_constant_1.MIME_TYPE)
        .map((e) => e)
        .flat(), renameIfMimeWrong = true, }) {
        super({ acceptMimeType, renameIfMimeWrong });
    }
    buildErrorMessage() {
        return `Validation failed (expected type is ${this.validationOptions.acceptMimeType.join(', ')})`;
    }
    async isValid(file) {
        if (!this.validationOptions) {
            return true;
        }
        return (!!file &&
            'mimetype' in file &&
            this.validationOptions.acceptMimeType.includes(file.mimetype));
    }
}
exports.UploaderFileTypeValidator = UploaderFileTypeValidator;
