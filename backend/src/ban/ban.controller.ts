import { Controller, Get, Post, Body, Param,UseGuards } from '@nestjs/common';
import { BanService } from './ban.service';

import { JwtTfaGuard } from 'src/iam/authentication/guards/jwt-tfa.guard';

@UseGuards(JwtTfaGuard)
@Controller('ban')
export class BanController {
  constructor(private readonly banService: BanService) {}

  @Post()
  create(@Body() createBanDto:any) {
    return this.banService.create(createBanDto);
  }

  @Get()
  findAll() {
    return this.banService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.banService.findOne(+id);
  }
}
