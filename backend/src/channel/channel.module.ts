import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Message } from 'src/message/entities/message.entity';
import { Users } from 'src/user/entities/user.entity';
import { Userchannel } from 'src/userchannel/entities/userchannel.entity';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/user/user.service';
import { UserchannelService } from 'src/userchannel/userchannel.service';
import { MuteService } from 'src/mute/mute.service';
import { BanService } from 'src/ban/ban.service';
import { Mute } from 'src/mute/entities/mute.entity';
import { Ban } from 'src/ban/entities/ban.entity';
import { Admin } from 'src/admins/entities/admin.entity';
import { AdminsService } from 'src/admins/admins.service';
import { kickService } from 'src/kick/kick.service';
import { Kick } from 'src/kick/entities/kick.entity';


@Module({
  controllers: [ChannelController],
  providers: [ChannelService,MessageService,UserService,UserchannelService,MuteService,BanService,AdminsService,kickService],
  imports:[TypeOrmModule.forFeature([Channel,Message,Users,Userchannel,Mute,Ban,Admin,Kick])]
})
export class ChannelModule {}
