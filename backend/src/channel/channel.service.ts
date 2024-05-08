import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class ChannelService {
  constructor(@InjectRepository(Channel)
  private readonly repositoryChannel:Repository<Channel>){}
  async create(createChannelDto: Channel) {
    const newChannel = this.repositoryChannel.create(createChannelDto);
    return this.repositoryChannel.save(newChannel);
  }

  findAll() {
    return this.repositoryChannel.find();
  }

  async findOne(id: number):Promise<Channel> {
    const options:FindOneOptions<Channel> = {
      where:{id:id},
      relations:{userChannel:true,message:true}
    }
    return this.repositoryChannel.findOne(options);
  }
  async update(id: number, channel: Partial<Channel>) {
    return await this.repositoryChannel.save(channel);
}
  async remove(id: number) {
    const options : FindOneOptions<Channel>={where:{id:id}}
    const user = await this.repositoryChannel.findOne(options);
    return this.repositoryChannel.remove(user);
  }
}
