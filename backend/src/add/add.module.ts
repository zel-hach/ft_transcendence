import { Module } from '@nestjs/common';
import { AddService } from './add.service';
import { AddController } from './add.controller';
import { Add } from './entities/add.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [AddController],
  providers: [AddService],
  imports: [TypeOrmModule.forFeature([Add])],

})
export class AddModule {}
