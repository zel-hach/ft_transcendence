import { Friendship } from 'src/friendship/entities/friendship.entity';
import { Users } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Friendship, (friendship) => friendship.friend)
  friendship: Friendship[];
}
