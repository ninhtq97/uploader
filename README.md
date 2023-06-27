# Installation

```bash
$ npm i github:ninhtq97/nestjs-module-uploader
```

# Module

- **Configuration**

  ```ts
  import { UploaderModule } from '@nestjs-module/uploader';

  @Module({
    imports: [
      UploaderModule.forRoot({
        dest: './uploads',
      }),
      ...
    ],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {}
  ```

- **Async Configuration**

  ```ts
  import { UploaderModule } from '@nestjs-module/uploader';

  @Module({
    imports: [
      UploaderModule.forRootAsync({
        useFactory: () => ({
          dest: './uploads',
        }),
      }),
      ...
    ],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {}
  ```

# Using

```ts
@Post('upload')
@UseInterceptors(
  UploaderInterceptor({
    fieldName: 'file',
    path: '/images',
    acceptMimetype: ['image/png', 'image/jpeg',...],
  }),
  UploaderValidatorInterceptor(),
)
upload(@UploadedFile() file: Express.Multer.File): string {
  console.log('File:', file);

  return file.path;
}
```
