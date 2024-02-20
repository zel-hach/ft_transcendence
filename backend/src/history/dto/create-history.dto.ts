import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateHistoryDto {
  @IsNotEmpty()
  @IsNumber()
  userid: number;

  @IsNotEmpty()
  @IsNumber()
  gameid: number;
}
