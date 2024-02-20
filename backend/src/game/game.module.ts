import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from 'src/history/entities/history.entity';
import { HistoryService } from 'src/history/history.service';
import { Game } from './entities/game.entity';
import { GameService } from './game.service';
import { Users } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Users, History])],
  providers: [GameService, UserService, HistoryService],
})
export class GameModule {}
