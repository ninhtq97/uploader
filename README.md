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

- **Get Stream File**

  ```ts
  @Get('stream')
  async getStream(@Query() q, @Res() response: Response) {
    const stream = await this.uploaderService.getStream(q.path);

    stream.pipe(response);
  }
  ```

- **Upload Single File**

  ```ts
  @UseInterceptors(
    UploaderInterceptor({
      fieldName: 'file',
      path: '/images',
      acceptMimetype: ['image/gif', ...],
    }),
    UploaderValidatorInterceptor(),
  )
  upload(@UploadedFile() file: Express.Multer.File): string {
    console.log('File:', file);
    ...
  }
  ```

- **Upload Array Of Files**

  ```ts
  @UseInterceptors(
    UploaderInterceptor({
      fieldName: 'files',
      maxCount: 5,
      path: '/images',
      acceptMimetype: ['image/png', 'image/jpeg',...],
    }),
    UploaderValidatorInterceptor(),
  )
  upload(@UploadedFiles() files: Array<Express.Multer.File>): string {
    console.log('Files:', files);
    ...
  }
  ```

- **Upload Multiple Files**

  ```ts
  @UseInterceptors(
    UploaderInterceptor({
      fields: [
        { name: 'avatar', maxCount: 1 },
        { name: 'background', maxCount: 1 },
      ],
      path: '/images',
      acceptMimetype: ['image/png', 'image/jpeg',...],
    }),
    UploaderValidatorInterceptor(),
  )
  upload(@UploadedFiles() files: { avatar?: Express.Multer.File[], background?: Express.Multer.File[] }): string {
    console.log('Files:', files);
    ...
  }
  ```

- **Required Files**
  ```ts
  @UseInterceptors(
   ...
   UploaderRequiredInterceptor()
  )
  ```
