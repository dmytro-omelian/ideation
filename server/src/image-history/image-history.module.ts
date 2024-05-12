import { Module } from '@nestjs/common';
import { ImageHistoryService } from './image-history.service';
import { ImageHistoryController } from './image-history.controller';

@Module({
  controllers: [ImageHistoryController],
  providers: [ImageHistoryService],
})
export class ImageHistoryModule {}
