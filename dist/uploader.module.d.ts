import { DynamicModule } from '@nestjs/common';
import { UploaderAsyncOptions } from './interfaces/uploader-async-options';
import { UploaderOptions } from './interfaces/uploader-options';
export declare class UploaderModule {
    static forRoot(options?: UploaderOptions): DynamicModule;
    static forRootAsync(options: UploaderAsyncOptions): DynamicModule;
}
