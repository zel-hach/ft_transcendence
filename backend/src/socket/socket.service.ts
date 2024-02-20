import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Add } from 'src/add/entities/add.entity';
import { Channel } from 'src/channel/entities/channel.entity';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Users } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SocketService {
  constructor(private readonly userService: UserService) {}
  private readonly userSocket: Map<number, Socket> = new Map();
  async setMap(socket: Socket, userId: number) {
    if (userId != undefined) {
      const user = await this.userService.findOne(userId);
      user.socketid = socket?.id;
      this.userSocket.set(userId, socket);
    }
  }
  async deleteMap(userId: number) {
    this.userService.update(userId, { socketid: null });
    this.userSocket.delete(userId);
  }

  findSocket(userId: number) {
    const socketId = this.userSocket.get(userId);
    if (socketId == undefined) {
      throw new HttpException('Socket not found', HttpStatus.NOT_FOUND);
    }
    return socketId;
  }

  async findUser(id: number): Promise<Socket | null> {
    let user: Socket | null = null;

    this.userSocket.forEach((socket, clientId) => {
      if (clientId == id) {
        user = socket;
      }
    });
    return user;
  }
  Message(
    sender: Users,
    recived: Users,
    conversation: Conversation,
    text_message: string,
    currentDate: string,
  ) {
    let reciveClient: Socket;
    try {
      this.userSocket.forEach((socket, clientId) => {
        if (clientId == recived.id) {
          reciveClient = socket;
        }
      });
      if (reciveClient) {
        reciveClient.emit('MessageFrom', {
          Users: sender,
          conversation,
          text_message,
          createdAt: currentDate,
          own: 'false',
        });
      }
    } catch (error) {
      console.log('user not found', error);
    }
  }
  async Conversation(
    reciveId: Users,
    senderId: Users,
    conversation: Add,
    conversation2: Add,
  ) {
    let senderClient: Socket;
    let reciveClient: Socket;
    try {
      this.userSocket.forEach((socket, clientId) => {
        if (clientId == reciveId.id) {
          reciveClient = socket;
        } else if (clientId == senderId.id) {
          senderClient = socket;
        }
      });
      if (reciveClient) reciveClient.emit('ConversationFrom', conversation2);
      if (senderClient) senderClient.emit('ConversationFrom', conversation);
    } catch (error) {
      console.log('Error in Conversation method: ', error);
    }
  }

  async AddFriendToChannel(myChannel: Channel, userid: number) {
    let reciveClient: Socket;
    try {
      this.userSocket.forEach((socket, clientId) => {
        if (clientId == userid) {
          reciveClient = socket;
        }
      });
      if (reciveClient) reciveClient.emit('newChannel', myChannel);
      else throw 'this user not login';
    } catch (e) {
      console.log(e);
    }
  }

  async inviteToFriends(user1: Users, user2: Users) {
    let reciveClient: Socket;
    try {
      this.userSocket.forEach((socket, clientId) => {
        if (clientId == user2.id) {
          reciveClient = socket;
        }
      });
      if (reciveClient) reciveClient.emit('accept', user1);
    } catch (e) {
      console.log(e);
    }
  }
}
