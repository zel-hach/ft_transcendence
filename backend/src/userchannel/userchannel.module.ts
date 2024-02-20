import { Module } from '@nestjs/common';
import { UserchannelService } from './userchannel.service';
import { UserchannelController } from './userchannel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Userchannel } from './entities/userchannel.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { Users } from 'src/user/entities/user.entity';

@Module({
  controllers: [UserchannelController],
  providers: [UserchannelService],
  imports:[TypeOrmModule.forFeature([Userchannel,Channel,Users])],
})
export class UserchannelModule {}
