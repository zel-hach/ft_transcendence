import { FriendRequest } from 'src/friend-request/entities/friend-request.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RequestSend {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => FriendRequest, (receiver) => receiver.request)
  friendrequest: FriendRequest[];
}
