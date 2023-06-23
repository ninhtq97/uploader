"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderFileTypeValidator = void 0;
const common_1 = require("@nestjs/common");
const file_type_1 = require("file-type");
class UploaderFileTypeValidator extends common_1.FileValidator {
    constructor(uploaderService, validationOptions) {
        super(validationOptions);
        this.uploaderService = uploaderService;
    }
    buildErrorMessage() {
        return `Validation failed (expected type is ${this.validationOptions.fileType})`;
    }
    async isValid(file) {
        if (!this.validationOptions) {
            return true;
        }
        console.log('Pipe File:', file);
        const stream = await this.uploaderService.getStream(file.path);
        const { ext, mime } = await (0, file_type_1.fileTypeFromStream)(stream);
        console.log('Ext:', ext);
        console.log('Mime:', mime);
        return (!!file &&
            'mimetype' in file &&
            !!mime.match(this.validationOptions.fileType));
    }
}
exports.UploaderFileTypeValidator = UploaderFileTypeValidator;
