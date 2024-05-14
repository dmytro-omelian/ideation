import { Memory } from 'src/memory/entities/memory.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { StyleImage } from './style-image.entity';
import { Collection } from 'src/collection/entities/collection.entity';
import { Optional } from "@nestjs/common";

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageS3Id: string;

  @Column()
  userId: number;
  
  @ManyToOne(() => User, (user) => user.images)
  @JoinTable({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  caption: string;

  @Column('simple-array')
  tags: string[];

  @Column({ type: 'date' })
  date: Date;

  @Column()
  location: string;

  @OneToMany(() => Memory, (memory) => memory.image)
  memories: Memory[];

  @OneToMany(() => StyleImage, (styleImage) => styleImage.image)
  styleImages: StyleImage[];

  @ManyToMany(() => Collection)
  @JoinTable()
  collections: Collection[];
}
