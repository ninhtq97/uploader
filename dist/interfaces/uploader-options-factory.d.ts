import { UploaderOptions } from './uploader-options';
export interface UploaderOptionsFactory {
    createUploaderOptions(): Promise<UploaderOptions> | UploaderOptions;
}
