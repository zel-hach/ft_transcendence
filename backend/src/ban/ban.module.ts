import { Module } from '@nestjs/common';
import { BanService } from './ban.service';
import { BanController } from './ban.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ban } from './entities/ban.entity';

@Module({
  controllers: [BanController],
  providers: [BanService],
  imports:[TypeOrmModule.forFeature([Ban])]
})
export class BanModule {}
