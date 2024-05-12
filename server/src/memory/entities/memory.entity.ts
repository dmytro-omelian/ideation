import { Image } from 'src/image/image.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Memory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageId: number;

  @ManyToOne(() => Image, (image) => image.memories)
  image: Image;

  @ManyToOne(() => User, (user) => user.memories)
  user: User;

  @Column()
  text: string;
}
