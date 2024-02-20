import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserchannelService } from './userchannel.service';
import { CreateUserchannelDto } from './dto/create-userchannel.dto';

@Controller('userchannel')
export class UserchannelController {
  constructor(private readonly userchannelService: UserchannelService) {}

  @Post('/')
  create(@Body() createUserchannelDto: CreateUserchannelDto) {
    return this.userchannelService.create(createUserchannelDto);
  }

  @Get()
  findAll() {
    return this.userchannelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userchannelService.findOne(+id);
  }
}
