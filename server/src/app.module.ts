import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { User } from './user/entities/user.entity';
import { Image } from './image/entities/image.entity';
import { StyleImage } from './image/entities/style-image.entity';
import { Memory } from './memory/entities/memory.entity';
import { UserModule } from './user/user.module';
import { MemoryModule } from './memory/memory.module';
import { ImageModule } from './image/image.module';
import { AwsS3Module } from './aws-s3/aws-s3.module';
import { MulterModule } from '@nestjs/platform-express';
import { TelegramModule } from './telegram/telegram.module';
import { AuthModule } from './auth/auth.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Image, StyleImage, Memory],
      synchronize: true,
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    UserModule,
    MemoryModule,
    ImageModule,
    AwsS3Module,
    TelegramModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
