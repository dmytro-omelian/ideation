import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImageHistoryService } from './image-history.service';
import { CreateImageHistoryDto } from './dto/create-image-history.dto';
import { UpdateImageHistoryDto } from './dto/update-image-history.dto';

@Controller('image-history')
export class ImageHistoryController {
  constructor(private readonly imageHistoryService: ImageHistoryService) {}

  @Post()
  create(@Body() createImageHistoryDto: CreateImageHistoryDto) {
    return this.imageHistoryService.create(createImageHistoryDto);
  }

  @Get()
  findAll() {
    return this.imageHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imageHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageHistoryDto: UpdateImageHistoryDto) {
    return this.imageHistoryService.update(+id, updateImageHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageHistoryService.remove(+id);
  }
}
