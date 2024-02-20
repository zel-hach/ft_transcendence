import { IsNotEmpty, IsNumber } from 'class-validator';

export class RequestDto {
  @IsNotEmpty()
  @IsNumber()
  senderId: number;

  @IsNotEmpty()
  @IsNumber()
  receiverId: number;
}
