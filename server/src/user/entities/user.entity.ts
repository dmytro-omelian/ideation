import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsDate,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Memory } from 'src/memory/entities/memory.entity';
import { Image } from 'src/image/entities/image.entity';
import { StyleImage } from 'src/image/entities/style-image.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: true })
  @IsOptional()
  @IsString()
  firstName: string;

  @Column({ length: 50, nullable: true })
  @IsOptional()
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

  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDate()
  dateOfBirth: Date;

  @Column({ length: 10, nullable: true })
  @IsOptional()
  @IsString()
  gender: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
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
}
