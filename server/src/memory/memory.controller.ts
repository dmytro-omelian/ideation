import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from "@nestjs/common";
import { MemoryService } from './memory.service';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';

@Controller('memory')
export class MemoryController {
  constructor(private readonly memoryService: MemoryService) {}

  @Post()
  async create(@Body() createMemoryDto: CreateMemoryDto) {
    return await this.memoryService.create(createMemoryDto);
  }

  @Get()
  public async findAll(@Query('userId') userId: number, @Query('imageId') imageId: number) {
    // If you need to handle userId and imageId in your service, you can pass them as arguments
    return this.memoryService.findAll(userId, imageId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemoryDto: UpdateMemoryDto) {
    return this.memoryService.update(+id, updateMemoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.memoryService.remove(id);
      return { message: 'Memory deleted successfully' };
    } catch (error) {
      throw new HttpException('Memory not found', HttpStatus.NOT_FOUND);
    }
  }
}
