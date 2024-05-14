import { Image } from 'src/image/entities/image.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable } from "typeorm";

@Entity()
export class Memory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageId: number;

  @ManyToOne(() => Image, (image) => image.memories)
  @JoinTable({ name: 'imageId' })
  image: Image;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.memories)
  @JoinTable({ name: 'userId' })
  user: User;

  @Column()
  text: string;
}
