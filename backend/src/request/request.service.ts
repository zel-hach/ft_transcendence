import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { RequestSend } from './entities/request.entity';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(RequestSend)
    private requestRepository: Repository<RequestSend>,
  ) {}
  async create(requestDto: RequestSend) {
    const newRequest = this.requestRepository.create(requestDto);
    await this.requestRepository.save(newRequest);
    return newRequest;
  }

  async remove(id: number) {
    const options: FindOneOptions<RequestSend> = { where: { id: id } };
    const user = await this.requestRepository.findOne(options);
    return this.requestRepository.remove(user);
  }
}
