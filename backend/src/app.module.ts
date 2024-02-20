import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AddModule } from './add/add.module';
import { AdminsModule } from './admins/admins.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BanModule } from './ban/ban.module';
import { ChannelModule } from './channel/channel.module';
import { ConversationBlockedModule } from './conversation-blocked/conversation-blocked.module';
import { ConversationModule } from './conversation/conversation.module';
import { DatabaseModule } from './database.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { FriendsModule } from './friends/friends.module';
import { GameModule } from './game/game.module';
import { HistoryModule } from './history/history.module';
import { IamModule } from './iam/iam.module';
import { KickModule } from './kick/kick.module';
import { MessageModule } from './message/message.module';
import { MuteModule } from './mute/mute.module';
import { SocketModule } from './socket/socket.module';
import { UserchannelModule } from './userchannel/userchannel.module';
import { RequestModule } from './request/request.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    IamModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        JWT_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_TTL: Joi.string().required(),
        JWT_REFRESH_TOKEN_TTL: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    FriendsModule,
    GameModule,
    HistoryModule,
    SocketModule,
    AddModule,
    ChannelModule,
    UserchannelModule,
    ConversationBlockedModule,
    BanModule,
    MuteModule,
    AdminsModule,
    ConversationModule,
    MessageModule,
    FriendRequestModule,
    KickModule,
    RequestModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
