import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,) { }

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message =  this.messageRepository.create(createMessageDto)
    return this.messageRepository.save(message);
  }

  async createRepository(message: Message): Promise<Message>{
    const newmessage = this.messageRepository.create(message)
  
    return this.messageRepository.save(newmessage);
  }
  
  async findAllMessage(): Promise<Message[]> {
    const options: FindOneOptions<Message> = {
      order:{
        id:"ASC"
      },
      relations: {
        Users: true,
        conversation:true,
        channel:true,
      }
    }
    return this.messageRepository.find(options);
  }

  async findMessage(messageId: number): Promise<Message[] | undefined> {
    const options: FindOneOptions<Message> = {
      where: {
        id: messageId
      },
      relations: {
        Users: true
      }
    }
    return this.messageRepository.find(options);
  }
}