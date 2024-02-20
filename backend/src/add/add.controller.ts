import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AddService } from './add.service';
import { CreateAddDto } from './dto/create-add.dto';
import { JwtTfaGuard } from 'src/iam/authentication/guards/jwt-tfa.guard';

@UseGuards(JwtTfaGuard)
@Controller('addconversation')
export class AddController {
  constructor(private readonly addService: AddService) {}

  @Post('/')
  create(@Body() createAddDto: CreateAddDto) {
    return this.addService.create(createAddDto);
  }

  @Get('/')
  findAll() {
    return this.addService.findAll();
    }
  @Get('/conversation/:conversationId')
  findConversation(@Param('conversationId') conversationId: number) {
    return this.addService.findConversation(conversationId);
  }
  @Get('/users/:userId')
  findUser(@Param('userId', ParseIntPipe) userId: number) {    
    return this.addService.findUser(userId);
  }
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.addService.findOne(id);
  }
}
