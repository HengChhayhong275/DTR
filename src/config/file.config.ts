import { Injectable, NestInterceptor, Type, mixin } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
const path = require('path')

interface LocalFileInterceptorOptions {
    fieldName: string
}

export function LocalFileInterceptor(options: LocalFileInterceptorOptions): Type<NestInterceptor> {
    @Injectable()
    class Interceptor implements NestInterceptor {
        fileInterceptor: NestInterceptor;

        constructor(configService: ConfigService) {
            const destination = configService.get<string>('FILE_IMAGE_LOCATION');
            const multerOptions: MulterOptions = {
                storage: diskStorage({
                    destination,
                    filename: (req, file, cb) => {
                        let extension = path.extname(file.originalname)
                        let newFilename = Math.round(Math.random() * 1e9) + extension

                        return cb(null, newFilename)
                    }
                })
            }
            this.fileInterceptor = new (FileInterceptor(options.fieldName, multerOptions));
        }
        intercept(...args: Parameters<NestInterceptor['intercept']>){
            return this.fileInterceptor.intercept(...args)
        }
    }
    return mixin(Interceptor)
}