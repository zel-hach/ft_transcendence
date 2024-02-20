import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddService } from 'src/add/add.service';
import { Add } from 'src/add/entities/add.entity';
import { BanService } from 'src/ban/ban.service';
import { Ban } from 'src/ban/entities/ban.entity';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from 'src/channel/entities/channel.entity';
import { ConversationBlockedService } from 'src/conversation-blocked/conversation-blocked.service';
import { ConversationBlocked } from 'src/conversation-blocked/entities/conversation-blocked.entity';
import { ConversationService } from 'src/conversation/conversation.service';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { FriendRequest } from 'src/friend-request/entities/friend-request.entity';
import { FriendRequestService } from 'src/friend-request/friend-request.service';
import { FriendshipModule } from 'src/friendship/friendship.module';
import { Game } from 'src/game/entities/game.entity';
import { GameModule } from 'src/game/game.module';
import { GameService } from 'src/game/game.service';
import { History } from 'src/history/entities/history.entity';
import { HistoryModule } from 'src/history/history.module';
import { HistoryService } from 'src/history/history.service';
import { Kick } from 'src/kick/entities/kick.entity';
import { kickService } from 'src/kick/kick.service';
import { Mute } from 'src/mute/entities/mute.entity';
import { MuteService } from 'src/mute/mute.service';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { RequestService } from 'src/request/request.service';
import { UserModule } from 'src/user/user.module';
import { Users } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RequestSend } from 'src/request/entities/request.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([
      History,
      Conversation,
      Add,
      Users,
      Channel,
      Ban,
      Mute,
      ConversationBlocked,
      Kick,
      FriendRequest,
      RequestSend,
      Game,
    ]),
    GameModule,
    HistoryModule,
    FriendshipModule,
  ],
  providers: [
    SocketGateway,
    SocketService,
    GameService,
    HistoryService,
    ConversationService,
    AddService,
    UserService,
    ChannelService,
    BanService,
    MuteService,
    ConversationBlockedService,
    kickService,
    FriendRequestService,
    RequestService,
  ],
})
export class SocketModule {}
