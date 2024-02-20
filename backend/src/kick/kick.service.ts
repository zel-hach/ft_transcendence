import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Kick } from './entities/kick.entity';
import { CreateKickDto } from './dto/create-kick.dto';

@Injectable()
export class kickService {
  constructor(@InjectRepository(Kick) private readonly Kick_repository : Repository<Kick>,){}

  async create(createKickDto: any) {
    const Kicked = this.Kick_repository.create(createKickDto);
    return this.Kick_repository.save(Kicked);
  }

  findAll() {
    const options : FindOneOptions<Kick> = {
      relations:{users:true,channel:true}
    }
    return this.Kick_repository.find(options);
  }

  findOne(id: number) {
    const options : FindOneOptions<Kick> = {
      where:{id},
      relations:{users:true,channel:true}
    }
    return this.Kick_repository.findOne(options);
  }
  async remove(id: number) {
    const options : FindOneOptions<Kick>={where:{id:id}}
    const user = await this.Kick_repository.findOne(options);
    return this.Kick_repository.remove(user);
  }
}