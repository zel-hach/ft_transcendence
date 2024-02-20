import { IsBoolean, IsString } from 'class-validator';
import { Users } from 'src/user/entities/user.entity';
import { ManyToOne } from 'typeorm';

export class gameDto {
  @IsString()
  roomName?: string;
  @IsString()
  socketId?: string;
  @IsString()
  receiverId?: string;
  @IsBoolean()
  right?: boolean;
  @IsBoolean()
  left?: boolean;
  @IsString()
  dificulty: string;
  @IsString()
  status: string;
  @ManyToOne(() => Users, (user) => user.game)
  winner?: Users;
  @ManyToOne(() => Users, (user) => user.game)
  losser?: Users;
}

export type postion = {
  x: number;
  y: number;
  z: number;
};
