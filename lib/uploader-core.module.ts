import {
  DynamicModule,
  Global,
  Module,
  Provider,
  ValueProvider,
} from '@nestjs/common';
import { UPLOADER_OPTIONS } from './constants/uploader.constant';
import { UploaderAsyncOptions } from './interfaces/uploader-async-options';
import { UploaderOptions } from './interfaces/uploader-options';
import { UploaderOptionsFactory } from './interfaces/uploader-options-factory';
import { UploaderService } from './uploader.service';

@Global()
@Module({})
export class UploaderCoreModule {
  public static forRoot(options: UploaderOptions): DynamicModule {
    const MailerOptionsProvider: ValueProvider<UploaderOptions> = {
      provide: UPLOADER_OPTIONS,
      useValue: options,
    };

    return {
      module: UploaderCoreModule,
      providers: [MailerOptionsProvider, UploaderService],
      exports: [UploaderService],
    };
  }

  public static forRootAsync(options: UploaderAsyncOptions): DynamicModule {
    const providers: Provider[] = this.createAsyncProviders(options);

    return {
      module: UploaderCoreModule,
      providers: [
        ...providers,
        UploaderService,
        ...(options.extraProviders || []),
      ],
      imports: options.imports,
      exports: [UploaderService],
    };
  }

  private static createAsyncProviders(
    options: UploaderAsyncOptions,
  ): Provider[] {
    const providers: Provider[] = [this.createAsyncOptionsProvider(options)];

    if (options.useClass) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });
    }

    return providers;
  }

  private static createAsyncOptionsProvider(
    options: UploaderAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        name: UPLOADER_OPTIONS,
        provide: UPLOADER_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      name: UPLOADER_OPTIONS,
      provide: UPLOADER_OPTIONS,
      useFactory: async (optionsFactory: UploaderOptionsFactory) => {
        return optionsFactory.createUploaderOptions();
      },
      inject: [options.useExisting! || options.useClass!],
    };
  }
}
