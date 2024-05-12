import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { Image } from './image/image.entity';
import { Collection } from './collection/entities/collection.entity';
import { StyleImage } from './image/entities/style-image.entity';
import { ImageHistory } from './image-history/entities/image-history.entity';
import { Memory } from './memory/entities/memory.entity';
import { UserModule } from './user/user.module';
import { MemoryModule } from './memory/memory.module';
import { ImageHistoryModule } from './image-history/image-history.module';
import { CollectionModule } from './collection/collection.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'newuser',
      password: 'password',
      database: 'test',
      entities: [User, Image, Collection, StyleImage, ImageHistory, Memory],
      synchronize: true,
    }),
    UserModule,
    MemoryModule,
    ImageModule,
    CollectionModule,
    ImageHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
