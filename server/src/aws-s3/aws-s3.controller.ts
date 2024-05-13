import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { CreateAwsS3Dto } from './dto/create-aws-s3.dto';
import { UpdateAwsS3Dto } from './dto/update-aws-s3.dto';

@Controller('aws-s3')
export class AwsS3Controller {
  constructor(private readonly awsS3Service: AwsS3Service) {}
}
