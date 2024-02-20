import { Users } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ default: 0 })
  score1: number;

  @Column({ default: 0 })
  score2: number;

  @Column()
  avatar1: string;

  @Column()
  avatar2: string;

  @Column()
  winner: string;

  @Column()
  loser: string;

  @ManyToOne(() => Users, (user) => user.history)
  user: Users;
}
