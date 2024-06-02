import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AwsS3Service } from './aws-s3/aws-s3.service';

@Controller()
export class AppController {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  @Get('test')
  async getImage(@Query('key') key: string, @Res() res: Response) {
    try {
      const s3Url = `https://${this.awsS3Service.AWS_S3_BUCKET}.s3.eu-north-1.amazonaws.com/${key}`;
      console.log(s3Url);
      const imageData = await this.awsS3Service.getImageFromS3(s3Url);

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
