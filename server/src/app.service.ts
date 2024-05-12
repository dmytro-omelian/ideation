import { Injectable, Req, Res } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as axios from 'axios';

@Injectable()
export class AppService {
  AWS_S3_BUCKET = 'do-ideation-diploma';
  s3 = new AWS.S3({
    accessKeyId: 'AKIAQ3D7IBZA6TSH6RQO',
    secretAccessKey: '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',
  });

  async uploadFile(file) {
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
      let s3Response = await this.s3.upload(params).promise();
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
