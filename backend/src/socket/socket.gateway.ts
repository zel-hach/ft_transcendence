import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AddService } from 'src/add/add.service';
import { BanService } from 'src/ban/ban.service';
import { ChannelService } from 'src/channel/channel.service';
import { ConversationBlockedService } from 'src/conversation-blocked/conversation-blocked.service';
import { FriendRequestService } from 'src/friend-request/friend-request.service';
import { FriendshipService } from 'src/friendship/friendship.service';
import { GameService } from 'src/game/game.service';
import { gameDto } from 'src/game/gameDto';
import { kickService } from 'src/kick/kick.service';
import { MuteService } from 'src/mute/mute.service';
import { ClientDto } from 'src/user/dto/client.dto';
import { Users } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RequestDto } from './dto/request.dto';
import { SocketService } from './socket.service';

@WebSocketGateway({ namespace: 'socket', cors: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly socketService: SocketService,
    private readonly gameService: GameService,
    private readonly friendshipService: FriendshipService,
    private readonly addConversation: AddService,
    private readonly userService: UserService,
    private readonly channelService: ChannelService,
    private readonly banService: BanService,
    private readonly muteService: MuteService,
    private readonly blockService: ConversationBlockedService,
    private readonly kickService: kickService,
    private readonly requestService: FriendRequestService,
  ) {}
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('saveClient')
  saveClient(@MessageBody() clientDto: any, @ConnectedSocket() client: any) {
    this.socketService.setMap(client, clientDto.login);
    client.user = clientDto.login;
  }

  @SubscribeMessage('removeClient')
  removeClient(@MessageBody() clientDto: Partial<ClientDto>) {
    this.socketService.deleteMap(clientDto.userId);
  }

  @SubscribeMessage('friend-request')
  async friendRequest(@MessageBody() requestDto: RequestDto) {
    try {
      await this.requestService.addFriendRequest(requestDto);
      const socketId = this.socketService.findSocket(requestDto.receiverId);
      const sender = await this.userService.findOne(requestDto.senderId);
      socketId.emit('friend-request', { sender: sender.username });
    } catch (err) {
      throw err;
    }
  }

  @SubscribeMessage('get-requests')
  async getFriendRequests(@MessageBody() userId: any) {
    try {
      const socketId = this.socketService.findSocket(userId);
      const userRequests = await this.requestService.getRequests(userId);
      socketId.emit('get-requests', userRequests);
    } catch (err) {
      throw err;
    }
  }

  @SubscribeMessage('accept-friend')
  async acceptFriend(@MessageBody() requestDto: RequestDto) {
    try {
      const socketId = this.socketService.findSocket(requestDto.receiverId);
      const receiver = await this.userService.findOne(requestDto.senderId);
      this.friendshipService.addFriend({
        userId1: requestDto.senderId,
        userId2: requestDto.receiverId,
      });
      this.requestService.removeRequest(
        requestDto.senderId,
        requestDto.receiverId,
      );
      socketId.emit('accept-friend', { reciver: receiver.username });
    } catch (err) {
      throw err;
    }
  }

  @SubscribeMessage('Message')
  async HandleMessage(@MessageBody() data: any) {
    try {
      const AlladdConversation = await this.addConversation.findAll();
      const myConv = AlladdConversation.filter((e) => {
        return e.users.id == data.senderId;
      });
      const convIds = myConv.map((e) => e.conversation.id);
      const Conv = AlladdConversation.find((e) => {
        return (
          convIds.includes(e.conversation.id) && e.users.id == data.reciveId
        );
      });
      const MyId = AlladdConversation.find((e) => {
        return (
          convIds.includes(e.conversation.id) && e.users.id == data.senderId
        );
      });
      const allBlockedConversation = this.blockService.findAll();
      const myBlockedCon = (await allBlockedConversation).find((element) => {
        return element.conversation.id == Conv.conversation.id;
      });
      if (myBlockedCon) {
        return myBlockedCon;
      }
      return this.socketService.Message(
        MyId.users,
        Conv.users,
        Conv.conversation,
        data.text_message,
        data.currentDate,
      );
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('Conversation')
  async HandleConversation(@MessageBody() data: any) {
    const findConversation = await this.addConversation.findAll();
    const myPrivateConversation = findConversation.filter((u) => {
      return u.users.id == data.myid;
    });
    const conversationIds = myPrivateConversation.map(
      (element) => element.conversation.id,
    );
    const reciveconv = findConversation.find((element) => {
      return (
        conversationIds.includes(element.conversation.id) &&
        element.users.id == data.userid
      );
    });
    const senderconv = findConversation.find((element) => {
      return (
        conversationIds.includes(element.conversation.id) &&
        element.users.id == data.myid
      );
    });
    const user1: Users = await this.userService.findOne(data.myid);
    const user2: Users = await this.userService.findOne(data.userid);
    return this.socketService.Conversation(
      user2,
      user1,
      reciveconv,
      senderconv,
    );
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    await client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody() room: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(room);
    client.emit('leavedRoom', room);
  }

  @SubscribeMessage('messagetoRoom')
  async handleMessage(client: Socket, payload: any) {
    try {
      const allMuted = await this.muteService.findAll();
      const allKicked = await this.kickService.findAll();
      const isKicked = allKicked.find((e) => {
        return (
          e.channel.id == payload.channelid && e.users.id == payload.sender
        );
      });
      const isMuted = allMuted.find((e) => {
        return (
          e.channel.id == payload.channelid && e.users.id == payload.sender
        );
      });
      if (
        isMuted &&
        new Date(isMuted.mutedTime).getTime() >
          new Date(payload.currentDate).getTime()
      )
        return 0;
      else {
        if (isMuted) this.muteService.remove(isMuted.id);
        const allBaned = await this.banService.findAll();
        const isbaned = allBaned.find((e) => {
          return (
            e.users.id == payload.sender && e.channel.id == payload.channelid
          );
        });
        if (isbaned || isKicked) return 0;
        else {
          const sender = await this.userService.findOne(payload.sender);
          const channel = await this.channelService.findOne(payload.channelid);
          this.server.to(payload.room).emit('message', {
            Users: sender,
            channel,
            text_message: payload.message,
            createdAt: payload.currentDate,
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('createChannel')
  async createChannel(client: Socket, channel: any) {
    try {
      const channel1 = await this.channelService.findAll();
      const myChannel = channel1.find((e) => {
        return e.channelName == channel;
      });
      this.server.emit('newChannel', myChannel);
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('AddUserToChannel')
  async AddUserToChannel(client: Socket, channel: any) {
    try {
      const channel1 = await this.channelService.findAll();
      const myChannel = channel1.find((e) => {
        return e.channelName == channel.channelName;
      });
      this.socketService.AddFriendToChannel(myChannel, channel.friendId);
    } catch (e) {
      console.log(e);
    }
  }
  @SubscribeMessage('ban_kick')
  async banUser(client: Socket, user: any) {
    try {
      const userbaned = await this.socketService.findUser(user.user);
      const allchannel = await this.channelService.findAll();
      const myChannel = allchannel.find((e) => {
        return e.channelName == user.channelName;
      });
      const allBaned = await this.banService.findAll();
      const isbanned = allBaned.find((e) => {
        return e.channel.id == myChannel.id && e.users.id == user.user;
      });
      const allkicked = await this.kickService.findAll();
      const iskicked = allkicked.find((e) => {
        return e.channel.id == myChannel.id && e.users.id == user.user;
      });
      if (userbaned) {
        if (iskicked || isbanned) {
          userbaned.leave(user.channelName);
          userbaned.emit('kick', myChannel);
        }
      } else throw 'user not login';
    } catch (e) {
      console.log(e);
    }
  }

  @SubscribeMessage('inviteFriend')
  async inviteFriend(client: Socket, user: any) {
    const user1: Users = await this.userService.findOne(user.myid);
    const user2: Users = await this.userService.findOne(user.userid);
    return this.socketService.inviteToFriends(user1, user2);
  }

  count = 0;
  roomData = new Map<string, any>();
  roomName = '';

  @SubscribeMessage('inviteTogame')
  async inviteTogame(
    @MessageBody() userid: any,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user2: Users = await this.userService.findOne(userid.userid);
      return this.gameService.createPrivateGame(
        client,
        this.roomData,
        user2.username,
        this.socketService.findSocket(userid.userid),
      );
    } catch (e) {
      console.log(e);
    }
  }

  handleDisconnect(socket: Socket) {
    try {
      for (const [key, value] of this.roomData) {
        if (socket.id == value?.player1?.socketId) {
          if (value?.status2 == 'pending') {
            this.roomData?.delete(key);
          }
          this.server.to(key).emit('leftGame', {
            status: 'gameOver',
            roomName: key,
            player1: '',
            player2: value?.player2,
          });
          clearInterval(value?.interval);
          this.roomData?.delete(key);
          return;
        } else if (socket.id == value?.player2?.socketId) {
          this.server.to(key).emit('leftGame', {
            status: 'gameOver',
            roomName: key,
            player1: value?.player1,
            player2: '',
          });
          clearInterval(value?.interval);
          this.roomData?.delete(key);
          return;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('leftRoom')
  leftRoom(
    @MessageBody() data: { roomName: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const { roomName } = data;
      const room = this.roomData.get(roomName);
      if (!room) return socket.emit('error');
      if (room.player1.socketId == socket.id) {
        this.roomData?.delete(roomName);
        return socket.to(roomName).emit('leftGame', {
          status: 'gameOver',
          player2: room.player2.socketId,
          player1: '',
        });
      }
      if (room.player2.socketId == socket.id) {
        this.roomData?.delete(roomName);
        return socket.to(roomName).emit('leftGame', {
          status: 'gameOver',
          player1: room.player1.socketId,
          player2: '',
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('findGame')
  findGame(@ConnectedSocket() socket: Socket, @MessageBody() data: gameDto) {
    try {
      this.gameService.findGame(socket, data, this.server, this.roomData);
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('joinPrivateGame')
  joinPrivGame(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: gameDto,
  ) {
    try {
      this.gameService.joinPrivateGame(
        socket,
        data,
        this.server,
        this.roomData,
      );
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('acceptGame')
  acceptGame(@MessageBody() data: gameDto, @ConnectedSocket() socket: Socket) {
    try {
      const room = this.roomData.get(data.roomName);
      const roomName = data.roomName;
      const id = 1;
      const player1 = room.player1;
      const status = data.status;
      if (!room || !roomName || id !== room.player2) return;
      if (!status || status !== 'accept') return;
      socket.join(roomName);
      this.roomData.set(roomName, {
        player1,
        player2: {
          socketId: socket.id,
          score: 0,
          position: { x: 0, y: 60 / 2 - 3, z: 0 },
        },
        watchers: [],
        interval: 0,
      });
    } catch (err) {
      console.log(err);
    }
  }

  @SubscribeMessage('startGame')
  startGame(@MessageBody() data: gameDto) {
    this.gameService.startGame(data, this.server, this.roomData);
  }

  @SubscribeMessage('paddleMove')
  paddleMove(@MessageBody() data: gameDto) {
    this.gameService.paddleMove(data, this.server, this.roomData);
  }

  @SubscribeMessage('joinToRoom')
  JoinToRoom(@MessageBody() data: gameDto, @ConnectedSocket() socket: Socket) {
    this.gameService.JoinToRoom(data, this.roomData, socket, this.server);
  }
}
