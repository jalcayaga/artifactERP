import { Controller, Post, UseInterceptors, UploadedFile, Res, Delete, Param, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { UploadsService } from './uploads.service';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Public()
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    return res.json({ filename: file.filename, url: `/uploads/${file.filename}` });
  }

  @Public()
  @Delete(':filename')
  async deleteImage(@Param('filename') filename: string, @Res() res: Response) {
    await this.uploadsService.deleteFile(filename);
    return res.status(HttpStatus.NO_CONTENT).send();
  }
}
