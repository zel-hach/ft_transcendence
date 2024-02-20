import { IsNotEmpty } from 'class-validator';
import { Socket } from 'socket.io';

export class ClientDto {
  @IsNotEmpty()
  socketId: Socket;

  @IsNotEmpty()
  userId: number;
}
