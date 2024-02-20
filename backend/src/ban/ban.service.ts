import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ban } from './entities/ban.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class BanService {
  constructor(@InjectRepository(Ban) private readonly Ban_repository : Repository<Ban>,){}

  async create(createBanDto: any) {
    const baned = this.Ban_repository.create(createBanDto);
    return this.Ban_repository.save(baned);
  }

  findAll() {
    const options : FindOneOptions<Ban> = {
      relations:{users:true,channel:true}
    }
    return this.Ban_repository.find(options);
  }

  findOne(id: number) {
    const options : FindOneOptions<Ban> = {
      where:{id},
      relations:{users:true,channel:true}
    }
    return this.Ban_repository.findOne(options);
  }
  async remove(id: number) {
    const options : FindOneOptions<Ban>={where:{id:id}}
    const user = await this.Ban_repository.findOne(options);
    return this.Ban_repository.remove(user);
  }
}
