import { IsNotEmpty, IsNumber } from 'class-validator';

export class CoordDto {
  @IsNotEmpty()
  @IsNumber()
  x: number;

  @IsNotEmpty()
  @IsNumber()
  y: number;
}
