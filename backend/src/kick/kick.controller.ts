import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

import { JwtTfaGuard } from 'src/iam/authentication/guards/jwt-tfa.guard';
import { kickService } from './kick.service';

UseGuards(JwtTfaGuard)
@Controller('kick')
export class kickController {
  constructor(private readonly kickService:kickService) {}

  @Post()
  create(@Body() createBanDto:any) {
    return this.kickService.create(createBanDto);
  }

  @Get()
  findAll() {
    return this.kickService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kickService.findOne(+id);
  }
}
