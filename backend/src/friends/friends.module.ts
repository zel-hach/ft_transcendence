import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { FriendshipService } from 'src/friendship/friendship.service';
import { Friendship } from 'src/friendship/entities/friendship.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Friend, Friendship]), UserModule],
  controllers: [FriendsController],
  providers: [FriendsService, FriendshipService],
  exports: [FriendsService],
})
export class FriendsModule {}
