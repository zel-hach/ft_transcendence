import { Friend } from 'src/friends/entities/friend.entity';
import { Users } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Friendship {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (users) => users.friendship)
  users: Users;

  @ManyToOne(() => Friend, (friend) => friend.friendship)
  friend: Friend;
}
