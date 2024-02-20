import { Injectable } from '@nestjs/common';
import { CreateUserchannelDto } from './dto/create-userchannel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Userchannel } from './entities/userchannel.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserchannelService {
  constructor(@InjectRepository(Userchannel)
    private readonly repositoryUserCh: Repository<Userchannel>){}
  create(createUserchannelDto: CreateUserchannelDto) {
    const userChannel = this.repositoryUserCh.create(createUserchannelDto);
    return(this.repositoryUserCh.save(userChannel));
  }

  findAll(){
    const options: FindOneOptions<Userchannel>={
     relations:{users:true,channel:true}
    }
    return this.repositoryUserCh.find(options);
  }

  findOne(id: number) {
    const options : FindOneOptions<Userchannel> = {
      where:{id : id},
      relations:{users:true,channel:true}
    }
    return this.repositoryUserCh.find(options);
  }

  async remove(id: number) {
    const options : FindOneOptions<Userchannel>={where:{id:id}}
    const user = await this.repositoryUserCh.findOne(options);
    if(user)
      return this.repositoryUserCh.remove(user);
  }
}
  