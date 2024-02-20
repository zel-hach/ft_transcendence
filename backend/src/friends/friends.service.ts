import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Friend } from './entities/friend.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
  ) {}

  async create(createFriendDto: Friend) {
    const newFriend = this.friendRepository.create(createFriendDto);
    return await this.friendRepository.save(newFriend);
  }

  async findAll() {
    return await this.friendRepository.find();
  }

  async findOne(id: number) {
    const friend = await this.friendRepository.findOne({ where: { id } });
    if (friend) return friend;
    throw new HttpException('Friend not found!', HttpStatus.NOT_FOUND);
  }

  async remove(id: number) {
    const deleted = await this.friendRepository.delete(id);
    if (!deleted.affected)
      throw new HttpException('Friend not found', HttpStatus.NOT_FOUND);
  }
}
