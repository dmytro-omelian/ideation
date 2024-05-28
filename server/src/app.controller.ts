import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { Response } from 'express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hi')
  sayHi() {
    return 'hi';
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.appService.uploadFile(file);
  }

  @Get('test')
  async getImage(@Query('key') key: string, @Res() res: Response) {
    try {
      const s3Url = `https://${this.appService.AWS_S3_BUCKET}.s3.eu-north-1.amazonaws.com/${key}`;
      console.log(s3Url);
      const imageData = await this.appService.getImageFromS3(s3Url);

      res.set({
        'Content-Type': 'image/png',
        'Content-Length': imageData.length.toString(),
      });
      res.send(imageData);
    } catch (error) {
      console.error('Error fetching image:', error);
      res.status(500).send('Error fetching image from S3');
    }
  }
}
