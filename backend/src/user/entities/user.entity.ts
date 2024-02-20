import { Exclude } from 'class-transformer';
import { Add } from 'src/add/entities/add.entity';
import { Admin } from 'src/admins/entities/admin.entity';
import { Ban } from 'src/ban/entities/ban.entity';
import { ConversationBlocked } from 'src/conversation-blocked/entities/conversation-blocked.entity';
import { FriendRequest } from 'src/friend-request/entities/friend-request.entity';
import { Friendship } from 'src/friendship/entities/friendship.entity';
import { Game } from 'src/game/entities/game.entity';
import { History } from 'src/history/entities/history.entity';
import { Kick } from 'src/kick/entities/kick.entity';
import { Message } from 'src/message/entities/message.entity';
import { Mute } from 'src/mute/entities/mute.entity';
import { Userchannel } from 'src/userchannel/entities/userchannel.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column({ unique: true })
  username: string;

  @Column()
  avatar: string;

  @Column({ default: 0 })
  wins: number;

  @Column({ default: 0 })
  loss: number;

  @Column()
  status: string;

  @Column({ default: false })
  tfa: boolean;

  @Column({ default: 0 })
  level: number;

  @Column({ default: 0 })
  exp: number;

  @Column({ nullable: true })
  @Exclude()
  tfaSecret: string;

  @Column({ nullable: true })
  @Exclude()
  socketid: string;

  @Column({ nullable: true })
  @Exclude()
  refresh?: string;

  @OneToMany(() => Friendship, (friendship) => friendship.users)
  friendship: Friendship[];

  @OneToMany(() => History, (history) => history.user)
  history: History[];

  @ManyToOne(() => Game, (game) => game.user)
  game: Game;

  @OneToMany(() => Message, (message) => message.Users, { cascade: true })
  @JoinColumn()
  message: Message[];

  @OneToMany(() => Add, (add) => add.users)
  @JoinColumn()
  add: Add[];

  @OneToMany(() => Userchannel, (userchannel) => userchannel.users)
  @JoinColumn()
  userChannel: Userchannel[];

  @OneToMany(() => ConversationBlocked, (add) => add.users)
  @JoinColumn()
  blocked: ConversationBlocked[];

  @OneToMany(() => Mute, (add) => add.users)
  @JoinColumn()
  muted: Mute[];

  @OneToMany(() => Ban, (add) => add.users)
  @JoinColumn()
  baned: Ban[];

  @OneToMany(() => Admin, (admin) => admin)
  @JoinColumn()
  admin: Admin[];

  @OneToMany(() => Kick, (kick) => kick.channel)
  @JoinColumn()
  kicked: Kick[];

  @OneToMany(() => FriendRequest, (request) => request.sender)
  request: FriendRequest[];
}
