import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as process from 'process';
import * as axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AwsS3Service {
  public readonly AWS_S3_BUCKET: string;
  public readonly s3: AWS.S3;

  constructor() {
    this.AWS_S3_BUCKET = process.env.AWS_S3_BUCKET_NAME;
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }
  async uploadFile(file: any) {
    console.log(file);
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET,
      originalname,
      file.mimetype,
    );
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }

  async getImageFromS3(url: string): Promise<Buffer> {
    try {
      const response = await axios.default.get(url, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data, 'binary');
    } catch (error) {
      console.error('Error fetching image from S3:', error);
      throw error;
    }
  }
}
