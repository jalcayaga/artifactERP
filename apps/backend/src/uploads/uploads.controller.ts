import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  Delete,
  Param,
  HttpStatus,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { Response } from 'express'
import { UploadsService } from './uploads.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) { }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '..', '..', 'uploads'),
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('')
          return cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Only image uploads are allowed.'),
            false
          )
        }
        cb(null, true)
      },
    })
  )
  uploadImage(@UploadedFile() file: Express.Multer.File, @Res() res: Response) {
    if (!file) {
      throw new BadRequestException('No file received.')
    }
    return res.json({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
    })
  }

  @Delete(':filename')
  async deleteImage(@Param('filename') filename: string, @Res() res: Response) {
    await this.uploadsService.deleteFile(filename)
    return res.status(HttpStatus.NO_CONTENT).send()
  }
}
