import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), AwsS3Module],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
