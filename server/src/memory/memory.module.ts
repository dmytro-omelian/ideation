import { Module } from '@nestjs/common';
import { MemoryService } from './memory.service';
import { MemoryController } from './memory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Memory } from './entities/memory.entity';
import { User } from '../user/entities/user.entity';
import { Image } from '../image/entities/image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Memory, User, Image])],
  controllers: [MemoryController],
  providers: [MemoryService],
})
export class MemoryModule {}
