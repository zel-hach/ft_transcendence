import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { History } from './entities/history.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class HistoryService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(History) private historyRepository: Repository<History>,
  ) {}

  async create(createHistory: History) {
    const newHistory = await this.historyRepository.create(createHistory);
    await this.historyRepository.save(newHistory);
    return newHistory;
  }

  findAll() {
    const options: FindOneOptions<History> = {
      relations: { user: true },
    };
    return this.historyRepository.find(options);
  }

  findOne(id: number) {
    return this.historyRepository.findOne({
      where: [{ winner: id.toString() }, { loser: id.toString() }],
    });
  }

  remove(id: number) {
    return `This action removes a #${id} history`;
  }
}
