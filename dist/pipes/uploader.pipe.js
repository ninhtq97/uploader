"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderFileTypeValidator = void 0;
const common_1 = require("@nestjs/common");
class UploaderFileTypeValidator extends common_1.FileTypeValidator {
    buildErrorMessage() {
        return `Validation failed (expected type is ${this.validationOptions.fileType})`;
    }
    isValid(file) {
        if (!this.validationOptions) {
            return true;
        }
        console.log('Pipe File:', file);
        return (!!file &&
            'mimetype' in file &&
            !!file.mimetype.match(this.validationOptions.fileType));
    }
}
exports.UploaderFileTypeValidator = UploaderFileTypeValidator;
