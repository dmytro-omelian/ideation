import { User } from 'src/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class ImageHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageId: string;

  @ManyToOne(() => User, (user) => user.imageHistories)
  user: User;

  @Column('simple-array', { nullable: true })
  dots: string[];

  @Column('simple-array', { nullable: true })
  rectangle: string[];

  @Column()
  updatedImageId: string;

  @Column('simple-array', { nullable: true })
  styleImageIds: string[];
}
