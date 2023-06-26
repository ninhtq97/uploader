"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderFileTypeValidator = void 0;
const common_1 = require("@nestjs/common");
const file_type_1 = require("file-type");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const uploader_constant_1 = require("../constants/uploader.constant");
const uploader_util_1 = require("../utils/uploader.util");
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
        const buffer = await (0, uploader_util_1.readChunk)(file.path, { length: 4100 });
        const { ext, mime } = await (0, file_type_1.fromBuffer)(buffer);
        if (!this.validationOptions.acceptMimeType.includes(mime)) {
            await (0, promises_1.unlink)(file.path);
            return false;
        }
        if (this.validationOptions.renameIfMimeWrong) {
            console.log('=====================Intercept Rename File If Mime Wrong');
            const name = (0, path_1.basename)(file.filename, (0, path_1.extname)(file.filename));
            const filename = `${name}.${ext}`;
            const path = `${file.destination}/${filename}`;
            await (0, promises_1.rename)(file.path, path);
            file = Object.assign(Object.assign({}, file), { mimetype: mime, filename, path: path });
        }
        return (!!file &&
            'mimetype' in file &&
            this.validationOptions.acceptMimeType.includes(mime));
    }
}
exports.UploaderFileTypeValidator = UploaderFileTypeValidator;
