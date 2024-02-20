import { Module } from '@nestjs/common';
import { MuteService } from './mute.service';
import { MuteController } from './mute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mute } from './entities/mute.entity';

@Module({
  controllers: [MuteController],
  providers: [MuteService],
  imports:[TypeOrmModule.forFeature([Mute])],
})
export class MuteModule {}
