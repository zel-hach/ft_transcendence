import { Module } from '@nestjs/common';
import { ConversationBlockedService } from './conversation-blocked.service';
import { ConversationBlockedController } from './conversation-blocked.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationBlocked } from './entities/conversation-blocked.entity';
import { Users } from 'src/user/entities/user.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';

@Module({
  controllers: [ConversationBlockedController],
  providers: [ConversationBlockedService],
  imports:[TypeOrmModule.forFeature([ConversationBlocked,Users,Conversation])]
})
export class ConversationBlockedModule {}
