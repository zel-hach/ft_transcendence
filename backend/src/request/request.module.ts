import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestSend } from './entities/request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RequestSend])],
  controllers: [RequestController],
  providers: [RequestService],
})
export class RequestModule {}
