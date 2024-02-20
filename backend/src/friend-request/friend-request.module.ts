import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { UserModule } from 'src/user/user.module';
import { FriendRequestController } from './friend-request.controller';
import { RequestService } from 'src/request/request.service';
import { RequestSend } from 'src/request/entities/request.entity';
import { Friendship } from 'src/friendship/entities/friendship.entity';
import { FriendshipModule } from 'src/friendship/friendship.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FriendRequest, RequestSend, Friendship]),
    UserModule,
    FriendshipModule,
  ],
  providers: [FriendRequestService, RequestService],
  controllers: [FriendRequestController],
})
export class FriendRequestModule {}
