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
const multer_1 = require("multer");
const uploader_constant_1 = require("../constants/uploader.constant");
const uploader_service_1 = require("../uploader.service");
const uploader_util_1 = require("../utils/uploader.util");
function UploaderInterceptor({ fieldName, uploadFields, maxCount, path, limits, acceptMimetype = Object.values(uploader_constant_1.MIME_TYPE)
    .map((e) => e)
    .flat(), destination, filename, }) {
    let Interceptor = class Interceptor {
        constructor(uploaderService) {
            this.uploaderService = uploaderService;
            const filesDest = this.uploaderService.uploaderOptions.dest;
            const multerOptions = {
                storage: (0, multer_1.diskStorage)({
                    destination: destination || (0, uploader_util_1.makeDes)((0, uploader_util_1.convertPath)(`${filesDest}/${path || ''}`)),
                    filename: filename || uploader_util_1.editFileName,
                }),
                fileFilter: (0, uploader_util_1.fileFilter)(acceptMimetype),
                limits: limits,
            };
            if (uploadFields) {
                this.fileInterceptor = new ((0, platform_express_1.FileFieldsInterceptor)(uploadFields, multerOptions))();
            }
            else if (maxCount) {
                this.fileInterceptor = new ((0, platform_express_1.FilesInterceptor)(fieldName, maxCount, multerOptions))();
            }
            else {
                this.fileInterceptor = new ((0, platform_express_1.FileInterceptor)(fieldName, multerOptions))();
            }
        }
        intercept(context, next) {
            const ctx = context.switchToHttp();
            const req = ctx.getRequest();
            req.headers[uploader_constant_1.UPLOADER_HEADERS.ACCEPT_MIME] = acceptMimetype;
            return this.fileInterceptor.intercept(context, next);
        }
    };
    Interceptor = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [uploader_service_1.UploaderService])
    ], Interceptor);
    return (0, common_1.mixin)(Interceptor);
}
exports.UploaderInterceptor = UploaderInterceptor;
