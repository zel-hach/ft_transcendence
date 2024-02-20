import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ConversationBlockedService } from './conversation-blocked.service';
import { CreateConversationBlockedDto } from './dto/create-conversation-blocked.dto';

import { JwtTfaGuard } from 'src/iam/authentication/guards/jwt-tfa.guard';

@UseGuards(JwtTfaGuard)
@Controller('conversation-blocked')
export class ConversationBlockedController {
  constructor(private readonly conversationBlockedService: ConversationBlockedService) {}


  @Post('/')
  create(@Body() createAddDto: CreateConversationBlockedDto) {
    return this.conversationBlockedService.create(createAddDto);
  }

  @Get('/')
  findAll() {
    return this.conversationBlockedService.findAll();
    }
  @Get('/conversation/:conversationId')
  findConversation(@Param('conversationId') conversationId: number) {
    return this.conversationBlockedService.findConversation(conversationId);
  }
  @Get('/users/:userId')
  findUser(@Param('userId', ParseIntPipe) userId: number) {    
    return this.conversationBlockedService.findUser(userId);
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.conversationBlockedService.findOne(id);
  }
}
