import { Injectable } from '@nestjs/common';
import * as axios from 'axios';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';

@Injectable()
export class AwsS3Service {
  private readonly AWS_S3_BUCKET: string;
  private readonly s3: AWS.S3;

  constructor() {
    this.AWS_S3_BUCKET = 'do-ideation-diploma';
    this.s3 = new AWS.S3({
      accessKeyId: 'AKIAQ3D7IBZA6TSH6RQO',
      secretAccessKey: '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',
    });
  }

  // TODO think about the file name (user_id + combine with real name)
  // TODO generate image hash or something like that
  
  async uploadFile(file: any) {
    console.log(file);
    const { originalname } = file;
    // TODO replace original name with user ID + image ID usage

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

  // async uploadFile(file: File) {
  //   // TODO: Replace original name with user ID + image ID usage
  //   const { name: originalname, type: mimetype } = file;

  //   return new Promise((resolve, reject) => {
  //     const buffer = fs.readFileSync(file.path);

  //     this.s3_upload(buffer, this.AWS_S3_BUCKET, originalname, mimetype)
  //       .then((result) => {
  //         resolve(result);
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // }

  // async s3_upload(file: File, bucket: string, name: string, mimetype: string) {
  //   const params = {
  //     Bucket: bucket,
  //     Key: name,
  //     Body: file,
  //     ACL: 'public-read',
  //     ContentType: mimetype,
  //     ContentDisposition: 'inline',
  //     CreateBucketConfiguration: {
  //       LocationConstraint: 'ap-south-1',
  //     },
  //   };

  //   try {
  //     let s3Response = await this.s3.upload(params).promise();
  //     return s3Response;
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  async getImageFromS3(key: string): Promise<Buffer> {
    try {
      const s3Url = `https://${this.AWS_S3_BUCKET}.s3.eu-north-1.amazonaws.com/${key}`;
      const response = await axios.default.get(s3Url, {
        responseType: 'arraybuffer',
      });
      return Buffer.from(response.data, 'binary');
    } catch (error) {
      console.error('Error fetching image from S3:', error);
      throw error;
    }
  }
}
