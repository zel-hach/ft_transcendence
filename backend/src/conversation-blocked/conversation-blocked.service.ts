import { Injectable } from '@nestjs/common';
import { CreateConversationBlockedDto } from './dto/create-conversation-blocked.dto';
import { UpdateConversationBlockedDto } from './dto/update-conversation-blocked.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationBlocked } from './entities/conversation-blocked.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateConversationDto } from 'src/conversation/dto/create-conversation.dto';

@Injectable()
export class ConversationBlockedService {
  constructor(@InjectRepository(ConversationBlocked)
  private readonly Blocked_repository: Repository<ConversationBlocked>) { }

  async create(createBlockedConversationDto: CreateConversationBlockedDto) {
    const BlockedConversation =  this.Blocked_repository.create(createBlockedConversationDto)
    return this.Blocked_repository.save(BlockedConversation);
  }
  async createRepository(Blocked: ConversationBlocked) {
    const BlockedConversation =  this.Blocked_repository.create(Blocked);
    return (this.Blocked_repository.save(BlockedConversation));
}
  async findAll() {
    const options: FindOneOptions<ConversationBlocked> = {
      relations: { users: true ,conversation:true}
    }
    return this.Blocked_repository.find(options);
  }
  async findUser(userId: number): Promise<ConversationBlocked[]> {
    const options: FindOneOptions<ConversationBlocked> = {
      relations : {users:true,conversation:true}
    }
    return this.Blocked_repository.find(options);
  }

  async findConversation(conversationId: number): Promise<ConversationBlocked[]> {
    const options: FindOneOptions<ConversationBlocked> = {
      relations: { conversation: true,users:true }
    }
    return this.Blocked_repository.find(options);
  }
  async findOne(id_Blocked: number): Promise<ConversationBlocked[] | undefined> {
    const options: FindOneOptions<ConversationBlocked> = {
      where: { id: id_Blocked },
      relations: { users: true, conversation:true}
    }
    return this.Blocked_repository.find(options);
  }
  async remove(id: number) {
    const options : FindOneOptions<ConversationBlocked>={where:{id:id}}
    const user = await this.Blocked_repository.findOne(options);
    return this.Blocked_repository.remove(user);
  }
}
