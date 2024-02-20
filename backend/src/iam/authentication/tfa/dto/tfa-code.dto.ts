import { IsNotEmpty, IsString, Length } from 'class-validator';

export class TfaCodeDto {
  @IsNotEmpty()
  @IsString()
  @Length(6)
  code: string;
}
