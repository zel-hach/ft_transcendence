import { Users } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  roomName?: string;

  @Column({ default: '' })
  socketId?: string;

  @Column({ default: '' })
  receiverId?: string;

  @Column({ default: false })
  right?: boolean;

  @Column({ default: false })
  left?: boolean;

  @Column({ default: '' })
  dificulty: string;

  @Column({ default: '' })
  status: string;

  @ManyToOne(() => Users, (user) => user.game)
  user: Users;
}

export type postion = {
  x: number;
  y: number;
  z: number;
};
