import { Injectable } from '@nestjs/common';
import { CreateMemoryDto } from './dto/create-memory.dto';
import { UpdateMemoryDto } from './dto/update-memory.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Memory } from "./entities/memory.entity";
import { Repository } from "typeorm";

@Injectable()
export class MemoryService {

  constructor(
    @InjectRepository(Memory) private readonly memoryRepository: Repository<Memory>
  ) {
  }

  public async create(createMemoryDto: CreateMemoryDto) {
    const memory = await this.memoryRepository.save(createMemoryDto);

    return memory;
  }

  public async findAll(userId: number, imageId: number) {
    const memories = await this.memoryRepository.find({
      where: {
        userId: userId,
        imageId: imageId,
      },
    });

    return memories;
  }

  findOne(id: number) {
    return `This action returns a #${id} memory`;
  }

  update(id: number, updateMemoryDto: UpdateMemoryDto) {
    return `This action updates a #${id} memory`;
  }

  public async remove(id: number) {
    try {
      const result = await this.memoryRepository.delete(id);

      if (result.affected === 0) {
        throw new Error('Memory not found');
      }
      return 'OK';
    } catch (error) {
      console.error('Error removing memory:', error);
      throw error;
    }
  }
}
