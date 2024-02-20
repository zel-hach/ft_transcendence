import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MuteService } from './mute.service';
import { CreateMuteDto } from './dto/create-mute.dto';
import { JwtTfaGuard } from 'src/iam/authentication/guards/jwt-tfa.guard';


@UseGuards(JwtTfaGuard)
@Controller('mute')
export class MuteController {
  constructor(private readonly muteService: MuteService) {}

  @Post()
  create(@Body() createMuteDto: CreateMuteDto) {
    return this.muteService.create(createMuteDto);
  }

  @Get()
  findAll() {
    return this.muteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.muteService.findOne(+id);
  }
}
