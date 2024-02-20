import { Injectable } from '@nestjs/common';
import { Add } from './entities/add.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateAddDto } from './dto/create-add.dto';

@Injectable()
export class AddService {
  constructor(@InjectRepository(Add)
  private readonly Add_repository: Repository<Add>) { }

  async create(createAddConversationDto: CreateAddDto) {
    const AddConversation = this.Add_repository.create(createAddConversationDto)
    return this.Add_repository.save(AddConversation);
  }
  async createRepository(add: Add) {
    const AddConversation = this.Add_repository.create(add);
    return (this.Add_repository.save(AddConversation));
}
  async findAll() {
    const options: FindOneOptions<Add> = {
      relations: { users: true ,conversation:true}
    }
    return await this.Add_repository.find(options);
  }
  async findUser(userId: number): Promise<Add[]> {
    const options: FindOneOptions<Add> = {
      relations : {users:true,conversation:true}
    }
    return this.Add_repository.find(options);
  }

  async findConversation(conversationId: number): Promise<Add[]> {
    const options: FindOneOptions<Add> = {
      relations: { conversation: true,users:true }
    }
    return this.Add_repository.find(options);
  }
  async findOne(id_add: number): Promise<Add[] | undefined> {
    const options: FindOneOptions<Add> = {
      where: { id: id_add },
      relations: { users: true, conversation:true}
    }
    return this.Add_repository.find(options);
  }
  async remove(id: number) {
    const options : FindOneOptions<Add>={where:{id:id}}
    const user = await this.Add_repository.findOne(options);
    return this.Add_repository.remove(user);
  }
}