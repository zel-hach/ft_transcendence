import { Injectable } from '@nestjs/common';
import { CreateMuteDto } from './dto/create-mute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mute } from './entities/mute.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class MuteService {
  constructor(@InjectRepository(Mute) private readonly Mute_repository : Repository<Mute>,){}

  async create(createBanDto: CreateMuteDto) {
    const baned = this.Mute_repository.create(createBanDto);
    return this.Mute_repository.save(baned);
  }

  findAll() {
    const options : FindOneOptions<Mute> = {
      relations:{users:true,channel:true}
    }
    return this.Mute_repository.find(options);
  }

  findOne(id: number) {
    const options : FindOneOptions<Mute> = {
      where:{id},
      relations:{users:true,channel:true}
    }
    return this.Mute_repository.findOne(options);
  } 
  async remove(id: number) {
    const options : FindOneOptions<Mute>={where:{id:id}}
    const user = await this.Mute_repository.findOne(options);
    return this.Mute_repository.remove(user);
  }
}
