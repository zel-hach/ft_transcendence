import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
  ) {}

  async create(createUser: Partial<Users>): Promise<Users> {
    try {
      const newUser = this.userRepository.create(createUser);
      await this.userRepository.save(newUser);
      return newUser;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (user) {
      return user;
    }
    throw new HttpException('Users not found!', HttpStatus.NOT_FOUND);
  }

  async findByUsername(username: string): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) {
      return user;
    }
  }

  async findByLogin(login: string): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { login } });
    if (user) {
      return user;
    }
  }

  async updateSingle(id: number, user: Partial<Users>) {
    try {
      const updateUser = await this.userRepository.update(id, user);
      if (await this.findOne(id)) {
        return updateUser;
      }
    } catch (err) {
      throw err;
    }
  }

  async update(id: number, user: Partial<Users>) {
    try {
      const olduser = await this.findOne(id);
      if (olduser) {
        const newuser = await this.userRepository.save({
          ...olduser,
          username: user.username,
          avatar: user.avatar,
          tfa: user.tfa,
        });
        return newuser;
      }
    } catch (err) {
      throw err;
    }
  }

  async setUserStatus(id: number, newStatus: string) {
    const user = await this.findOne(id);
    return await this.userRepository.save({ ...user, status: newStatus });
  }
  async remove(id: number) {
    const deletedUser = await this.userRepository.delete(id);
    if (!deletedUser.affected)
      throw new HttpException('Users not found!', HttpStatus.NOT_FOUND);
  }
}
