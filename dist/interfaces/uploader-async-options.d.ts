import { Provider } from '@nestjs/common';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { UploaderOptions } from './uploader-options';
import { UploaderOptionsFactory } from './uploader-options-factory';
export interface UploaderAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
    useClass?: Type<UploaderOptionsFactory>;
    useExisting?: Type<UploaderOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<UploaderOptions> | UploaderOptions;
    extraProviders?: Provider[];
}
