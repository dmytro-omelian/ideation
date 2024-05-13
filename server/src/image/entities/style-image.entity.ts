import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Image } from './image.entity';

@Entity()
export class StyleImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Image, (image) => image.styleImages)
  image: Image;

  @ManyToOne(() => User, (user) => user.styleImages)
  user: User;

  @Column()
  imageS3Id: string;
}
