import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { UserService } from 'src/user/user.service';
import { ConversationService } from 'src/conversation/conversation.service';
import { Message } from './entities/message.entity';
import { JwtTfaGuard } from 'src/iam/authentication/guards/jwt-tfa.guard';

@UseGuards(JwtTfaGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService,private readonly userService:UserService,private readonly conversationService : ConversationService) { }
  @Post('/')
  async create(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }

  @Get('/')
  findAll() {
    return this.messageService.findAllMessage();
  }

  @Get('/:messageId')
  findMessage(@Param('messageId') id: number) {
    return this.messageService.findMessage(id);
  }
}