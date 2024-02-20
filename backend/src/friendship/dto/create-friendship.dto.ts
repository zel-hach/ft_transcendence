import { IsNotEmpty, IsNumber } from 'class-validator';

export class FriendshipDto {
  @IsNotEmpty()
  @IsNumber()
  userId1: number;

  @IsNotEmpty()
  @IsNumber()
  userId2: number;
}
