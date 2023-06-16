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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const uploader_constant_1 = require("./constants/uploader.constant");
const uploader_util_1 = require("./utils/uploader.util");
let UploaderService = exports.UploaderService = class UploaderService {
    constructor(uploaderOptions) {
        this.uploaderOptions = uploaderOptions;
    }
    getAbsPath(path) {
        return (0, uploader_util_1.convertPath)(`${this.uploaderOptions.dest}/${path}`);
    }
    async accessFile(path) {
        try {
            console.log('Access File');
            await fs_1.promises.access(path, fs_1.constants.R_OK);
        }
        catch (exception) {
            console.log('Throw Access File');
            throw new common_1.NotFoundException();
        }
        return true;
    }
    async getStream(path) {
        console.log('Path:', path);
        const standardPath = this.getAbsPath(path);
        console.log('Standard Path:', standardPath);
        await this.accessFile(standardPath);
        return (0, fs_1.createReadStream)(standardPath, { autoClose: true });
    }
};
exports.UploaderService = UploaderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(uploader_constant_1.UPLOADER_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], UploaderService);
