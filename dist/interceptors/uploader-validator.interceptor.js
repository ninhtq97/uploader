"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderValidatorInterceptor = void 0;
const common_1 = require("@nestjs/common");
const file_type_1 = require("file-type");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const uploader_constant_1 = require("../constants/uploader.constant");
const uploader_util_1 = require("../utils/uploader.util");
function UploaderValidatorInterceptor({ acceptMimetype = Object.values(uploader_constant_1.MIME_TYPE)
    .map((e) => e)
    .flat(), renameIfMimeWrong = true, }) {
    let Interceptor = class Interceptor {
        async intercept(context, next) {
            const ctx = context.switchToHttp();
            const req = ctx.getRequest();
            const { file } = req;
            const buffer = await (0, uploader_util_1.readChunk)(file.path, { length: 4100 });
            const { ext, mime } = await (0, file_type_1.fromBuffer)(buffer);
            if (!acceptMimetype.includes(mime)) {
                console.log('=====================Intercept Throw Error Original Mime');
                await (0, promises_1.unlink)(file.path);
                throw new common_1.BadRequestException('Invalid original mime type');
            }
            if (renameIfMimeWrong) {
                console.log('=====================Intercept Rename File If Mime Wrong');
                const name = (0, path_1.basename)(file.filename, (0, path_1.extname)(file.filename));
                const filename = `${name}.${ext}`;
                const path = `${file.destination}/${filename}`;
                await (0, promises_1.rename)(file.path, path);
                req.file = Object.assign(Object.assign({}, file), { mimetype: mime, filename, path: path });
            }
            console.log('=====================Intercept Done');
            return next.handle();
        }
    };
    Interceptor = __decorate([
        (0, common_1.Injectable)()
    ], Interceptor);
    return (0, common_1.mixin)(Interceptor);
}
exports.UploaderValidatorInterceptor = UploaderValidatorInterceptor;
