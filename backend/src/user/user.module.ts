import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { FriendshipService } from 'src/friendship/friendship.service';
import { Friendship } from 'src/friendship/entities/friendship.entity';
import { FriendsService } from 'src/friends/friends.service';
import { Friend } from 'src/friends/entities/friend.entity';
import { FriendRequest } from 'src/friend-request/entities/friend-request.entity';
import { RequestService } from 'src/request/request.service';
import { RequestSend } from 'src/request/entities/request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Friendship,
      Friend,
      FriendRequest,
      RequestSend,
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    FriendshipService,
    FriendsService,
    FriendRequest,
    RequestService,
  ],
  exports: [UserService],
})
export class UserModule {}
