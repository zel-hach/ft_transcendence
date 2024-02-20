import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class AdminsService {
  constructor(@InjectRepository(Admin) private readonly adminRepository:Repository<Admin>,){}
  async create(createAdminDto: CreateAdminDto) {
    const newAdmin = await this.adminRepository.create(createAdminDto);
    return this.adminRepository.save(newAdmin);
  }

  findAll() {
    const options : FindOneOptions<Admin> = {
      relations:{users:true,channel:true}
    }
    return this.adminRepository.find(options);
  }
  findOne(id: number) {
    const options:FindOneOptions<Admin> = {
      where:{id:id},
      relations:{channel:true}
    }
    return this.adminRepository.findOne(options);
  }

  async remove(id: number) {
    const options : FindOneOptions<Admin>={where:{id:id}}
    const user = await this.adminRepository.findOne(options);
    return this.adminRepository.remove(user);
  }
}
