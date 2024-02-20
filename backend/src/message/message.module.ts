import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Users } from 'src/user/entities/user.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { UserService } from 'src/user/user.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { Add } from 'src/add/entities/add.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Message,Users,Conversation,Add])],
  controllers: [MessageController],
  providers: [MessageService,UserService,ConversationService],
})
export class MessageModule {}
