import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  findAll() {
    return `This action returns all user`;
  }

  public async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: { id: id },
    });
    return user;
  }

  public async findOneByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email: email },
    });
    return user;
  }

  async create(user: { email: string; password: string }): Promise<any> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await this.userRepo.save({
      ...user,
      password: hashedPassword,
    });
    return newUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const user = await this.userRepo.findOne({ where: { id: id } });
      if (!user) {
        throw new Error('User not found');
      }

      Object.assign(user, updateUserDto);

      await this.userRepo.save(user);

      return user;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
