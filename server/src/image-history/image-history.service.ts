import { Injectable } from '@nestjs/common';
import { CreateImageHistoryDto } from './dto/create-image-history.dto';
import { UpdateImageHistoryDto } from './dto/update-image-history.dto';

@Injectable()
export class ImageHistoryService {
  create(createImageHistoryDto: CreateImageHistoryDto) {
    return 'This action adds a new imageHistory';
  }

  findAll() {
    return `This action returns all imageHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imageHistory`;
  }

  update(id: number, updateImageHistoryDto: UpdateImageHistoryDto) {
    return `This action updates a #${id} imageHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} imageHistory`;
  }
}
