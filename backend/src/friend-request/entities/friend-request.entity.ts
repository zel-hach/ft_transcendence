import { RequestSend } from 'src/request/entities/request.entity';
import { Users } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (sender) => sender.request)
  sender: Users;

  @ManyToOne(() => RequestSend, (request) => request.friendrequest)
  request: RequestSend;
}
