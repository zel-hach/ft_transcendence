import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Add } from 'src/add/entities/add.entity';
import { UserService } from 'src/user/user.service';
import { AddService } from 'src/add/add.service';
import { Users } from 'src/user/entities/user.entity';
import { MessageService } from 'src/message/message.service';
import { Message } from 'src/message/entities/message.entity';
import { ConversationBlockedService } from 'src/conversation-blocked/conversation-blocked.service';
import { ConversationBlocked } from 'src/conversation-blocked/entities/conversation-blocked.entity';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService,UserService,AddService,MessageService,ConversationBlockedService],
  imports:[TypeOrmModule.forFeature([Conversation,Add,Users,Message,ConversationBlocked])],
})
export class ConversationModule {}
