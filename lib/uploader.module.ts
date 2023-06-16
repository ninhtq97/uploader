import { DynamicModule, Module } from '@nestjs/common';
import { UploaderAsyncOptions } from './interfaces/uploader-async-options';
import { UploaderOptions } from './interfaces/uploader-options';
import { UploaderCoreModule } from './uploader-core.module';

@Module({})
export class UploaderModule {
  public static forRoot(options?: UploaderOptions): DynamicModule {
    return {
      module: UploaderModule,
      imports: [UploaderCoreModule.forRoot(options)],
    };
  }

  public static forRootAsync(options: UploaderAsyncOptions): DynamicModule {
    return {
      module: UploaderModule,
      imports: [UploaderCoreModule.forRootAsync(options)],
    };
  }
}
