import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Add } from 'src/add/entities/add.entity';

@Injectable()
export class ConversationService {
  constructor(@InjectRepository(Conversation) private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Add) private readonly add_repository: Repository<Add>,) { }
  
  
 
  async create(conversation: Conversation): Promise<Conversation> {
    const newConversation = await this.conversationRepository.create(conversation);
    return this.conversationRepository.save(newConversation);
  }

  async findOne(conversationId: number): Promise<Conversation | undefined> {
    const options: FindOneOptions<Conversation> = {
      where: { id: conversationId},
      relations: {add:true,message:true}
    }
    return this.conversationRepository.findOne(options);
  }


  async findAll(): Promise<Conversation[]> {
    const options: FindOneOptions<Conversation> = {
      relations: { add: true, message: true }
    }
    return this.conversationRepository.find(options);
  }
}
