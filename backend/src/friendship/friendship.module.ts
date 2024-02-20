import { Module } from '@nestjs/common';
import { FriendshipService } from './friendship.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friendship } from './entities/friendship.entity';
import { Friend } from 'src/friends/entities/friend.entity';
import { FriendsModule } from 'src/friends/friends.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friendship, Friend]),
    FriendsModule,
    UserModule,
  ],
  providers: [FriendshipService],
  exports: [FriendshipService],
})
export class FriendshipModule {}
