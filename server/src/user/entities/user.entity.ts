import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDate,
  IsBoolean,
} from 'class-validator';
import { Memory } from 'src/memory/entities/memory.entity';
import { Image } from 'src/image/image.entity';
import { StyleImage } from 'src/image/entities/style-image.entity';
import { ImageHistory } from 'src/image-history/entities/image-history.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Column({ length: 50 })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column({ length: 100 })
  @IsNotEmpty()
  @IsString()
  password: string;

  @Column({ type: 'date' })
  @IsNotEmpty()
  @IsDate()
  dateOfBirth: Date;

  @Column({ length: 10 })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @Column({ type: 'text' })
  @IsNotEmpty()
  @IsString()
  bio: string;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @OneToMany(() => Image, (image) => image.user)
  images: Image[];

  @OneToMany(() => Memory, (memory) => memory.user)
  memories: Memory[];

  @OneToMany(() => StyleImage, (styleImage) => styleImage.user)
  styleImages: StyleImage[];

  @OneToMany(() => ImageHistory, (imageHistory) => imageHistory.user)
  imageHistories: ImageHistory[];
}
