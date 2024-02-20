import { Module } from '@nestjs/common';
import { kickService } from './kick.service';
import { kickController } from './kick.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kick } from './entities/kick.entity';

@Module({
  controllers: [kickController],
  providers: [kickService],
  imports:[TypeOrmModule.forFeature([Kick])]
})
export class KickModule {}
