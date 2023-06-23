"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderInterceptor = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const file_type_1 = require("file-type");
const multer_1 = require("multer");
const path_1 = require("path");
const uploader_constant_1 = require("../constants/uploader.constant");
const uploader_service_1 = require("../uploader.service");
const uploader_util_1 = require("../utils/uploader.util");
function UploaderInterceptor(options) {
    let Interceptor = class Interceptor {
        constructor(uploaderService) {
            this.uploaderService = uploaderService;
            const filesDest = this.uploaderService.uploaderOptions.dest;
            const multerOptions = {
                storage: (0, multer_1.diskStorage)({
                    destination: options.destination ||
                        (0, uploader_util_1.makeDes)((0, uploader_util_1.convertPath)(`${filesDest}/${options.path || ''}`)),
                    filename: options.filename || uploader_util_1.editFileName,
                }),
                fileFilter: options.fileFilter ||
                    (0, uploader_util_1.fileFilter)(Object.values(uploader_constant_1.MIME_TYPE)
                        .map((e) => e)
                        .flat()),
                limits: options.limits,
            };
            if (options.uploadFields) {
                this.fileInterceptor = new ((0, platform_express_1.FileFieldsInterceptor)(options.uploadFields, multerOptions))();
            }
            else if (options.maxCount) {
                this.fileInterceptor = new ((0, platform_express_1.FilesInterceptor)(options.fieldName, options.maxCount, multerOptions))();
            }
            else {
                this.fileInterceptor = new ((0, platform_express_1.FileInterceptor)(options.fieldName, multerOptions))();
            }
        }
        async intercept(context, next) {
            const ctx = context.switchToHttp();
            const req = ctx.getRequest();
            const intercept = await this.fileInterceptor.intercept(context, next);
            const { file } = req;
            console.log('File:', file);
            const buffer = await (0, uploader_util_1.readChunk)(file.path, { length: 4100 });
            const { ext, mime } = await (0, file_type_1.fromBuffer)(buffer);
            console.log('Ext:', ext);
            console.log('Mime:', mime);
            const filename = (0, path_1.basename)(file.filename, (0, path_1.extname)(file.filename));
            console.log('filename:', filename);
            console.log('New Filename:', `${filename}.${ext}`);
            return intercept;
        }
    };
    Interceptor = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [uploader_service_1.UploaderService])
    ], Interceptor);
    return (0, common_1.mixin)(Interceptor);
}
exports.UploaderInterceptor = UploaderInterceptor;
