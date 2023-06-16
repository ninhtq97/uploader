"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UploaderCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderCoreModule = void 0;
const common_1 = require("@nestjs/common");
const uploader_constant_1 = require("./constants/uploader.constant");
const uploader_service_1 = require("./uploader.service");
let UploaderCoreModule = exports.UploaderCoreModule = UploaderCoreModule_1 = class UploaderCoreModule {
    static forRoot(options) {
        const MailerOptionsProvider = {
            provide: uploader_constant_1.UPLOADER_OPTIONS,
            useValue: options,
        };
        return {
            module: UploaderCoreModule_1,
            providers: [MailerOptionsProvider, uploader_service_1.UploaderService],
            exports: [uploader_service_1.UploaderService],
        };
    }
    static forRootAsync(options) {
        const providers = this.createAsyncProviders(options);
        return {
            module: UploaderCoreModule_1,
            providers: [
                ...providers,
                uploader_service_1.UploaderService,
                ...(options.extraProviders || []),
            ],
            imports: options.imports,
            exports: [uploader_service_1.UploaderService],
        };
    }
    static createAsyncProviders(options) {
        const providers = [this.createAsyncOptionsProvider(options)];
        if (options.useClass) {
            providers.push({
                provide: options.useClass,
                useClass: options.useClass,
            });
        }
        return providers;
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                name: uploader_constant_1.UPLOADER_OPTIONS,
                provide: uploader_constant_1.UPLOADER_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            name: uploader_constant_1.UPLOADER_OPTIONS,
            provide: uploader_constant_1.UPLOADER_OPTIONS,
            useFactory: async (optionsFactory) => {
                return optionsFactory.createUploaderOptions();
            },
            inject: [options.useExisting || options.useClass],
        };
    }
};
exports.UploaderCoreModule = UploaderCoreModule = UploaderCoreModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], UploaderCoreModule);
