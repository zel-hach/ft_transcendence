import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { HistoryService } from 'src/history/history.service';
import { Repository } from 'typeorm';
import { ball, player1, stage } from './data';
import { Game } from './entities/game.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class GameService {
  constructor(
    private readonly userService: UserService,
    private readonly historyService: HistoryService,
    @InjectRepository(Game) private gameRepository: Repository<Game>,
  ) {}
  private roomName = '';

  async ballIntersectWall(ball1: any, signalX: number) {
    const w = stage.w / 2 - stage.cRight.args[0] / 2 - ball.args[0] / 2;
    if (ball1.x + signalX >= w || ball1.x + signalX <= -w) return 1;
    else return 0;
  }

  async ballIntersectPlayer(
    player: any,
    ball1: any,
    signalX: number,
    signalY: number,
  ) {
    const h1 = player.position.y + ball.args[0];
    const h2 = player.position.y - ball.args[0];
    if (ball1.y + signalY == h1 || ball1.y + signalY == h2) {
      const w = player.position.x + player1.size / 2 + ball.args[0];
      const w2 = player.position.x - player1.size / 2 - ball.args[0];
      if (ball1.x + signalX >= w2 && ball1.x + signalX <= w) return 1;
    } else {
      if (player.position.y > 0) {
        if (ball1.y + signalY > player.position.y) {
          return -1;
        }
      } else if (player.position.y < 0) {
        if (ball1.y + signalY < player.position.y) {
          return -1;
        }
      }
    }
  }

  async resetBall(roomName: string, roomData) {
    const room = roomData.get(roomName);
    if (!room || !room.ball) return;
    room.ball.position.x = 0;
    room.ball.position.y = 0;
  }

  async resetPlayers(roomName: string, roomData) {
    const room = roomData.get(roomName);
    if (!room || !room.player1 || !room.player2) return;
    room.player1.position.x = 0;
    room.player2.position.x = 0;
  }
  async disconnect(socket: Socket, server, roomData) {
    for (const [key, value] of roomData) {
      if (socket.id == value?.player1?.socketId) {
        if (value?.status == 'pending') {
          roomData?.delete(key);
        }
        server.to(key).emit('leftGame', {
          status: 'gameOver',
          roomName: key,
          player1: '',
          player2: value?.player2,
        });
        clearInterval(value?.interval);
        roomData?.delete(key);
        return;
      } else if (socket.id == value?.player2?.socketId) {
        server.to(key).emit('leftGame', {
          status: 'gameOver',
          roomName: key,
          player1: value?.player1,
          player2: '',
        });
        clearInterval(value?.interval);
        roomData?.delete(key);
        return;
      }
    }
  }
  async joinPrivateGame(socket, data, server, roomData) {
    const { roomName, type } = data;
    const currentRoom = roomData.get(roomName);
    if (currentRoom && currentRoom.player2.socketId.user == socket.user) {
      if (type == 'accept') {
        roomData.set(roomName, {
          ...currentRoom,
          status: 'pending',
          player2: {
            socketId: socket.id,
            intraName: socket.user,
            score: 0,
            position: { x: 0, y: 60 / 2 - 3, z: 0 },
          },
          watchers: [],
          interval: 0,
        });
        socket.join(roomName);
        server.to(roomName).emit('joinRoom', {
          status: 'pending',
          roomName: roomName,
          player1: currentRoom.player1.socketId,
          player2: socket.id,
          dificulty: currentRoom.dificulty,
        });
      } else {
        roomData?.delete(roomName);
      }
    }
  }

  async createPrivateGame(socket, roomData, intraName, userSocket) {
    this.roomName =
      Math.random().toString(36).substring(2) +
      new Date().getTime().toString(36);
    roomData.set(this.roomName, {
      ball: {
        position: { x: 0, y: 0, z: 1 },
        args: [1, 100, 100],
      },
      player1: {
        socketId: socket.id,
        intraName: socket.user,
        score: 0,
        position: { x: 0, y: -60 / 2 + 3, z: 0 },
      },
      player2: {
        intraName: intraName,
        socketId: userSocket,
      },
      type: 'private',
      status: 'created',
      dificulty: 'easy',
    });
    socket.join(this.roomName);
    return userSocket.emit('requestToPlay', {
      roomName: this.roomName,
      userName: socket.user,
    });
  }

  async findGame(socket, data, server, roomData) {
    const roomFound = [...roomData.entries()]
      .filter(
        ({ 1: v }) => v.status == 'created' && v.dificulty == data.dificulty,
      )
      .map(([k]) => k);
    const currentRoom = roomData.get(roomFound[0]);
    if (!roomFound[0]) {
      this.roomName =
        Math.random().toString(36).substring(2) +
        new Date().getTime().toString(36);
      roomData.set(this.roomName, {
        ball: {
          position: { x: 0, y: 0, z: 1 },
          args: [1, 100, 100],
        },
        player1: {
          socketId: socket.id,
          intraName: socket.user,
          score: 0,
          position: { x: 0, y: -60 / 2 + 3, z: 0 },
        },
        type: 'public',
        status: 'created',
        dificulty: data.dificulty,
      });
      socket.join(this.roomName);
    } else {
      if (currentRoom.player1.intraName === socket.user)
        return socket.emit('error');
      roomData.set(roomFound[0], {
        ...currentRoom,
        status: 'pending',
        player2: {
          socketId: socket.id,
          intraName: socket.user,
          score: 0,
          position: { x: 0, y: 60 / 2 - 3, z: 0 },
        },
        watchers: [],
        interval: 0,
      });
      socket.join(roomFound[0]);
      server.to(roomFound[0]).emit('joinRoom', {
        status: 'pending',
        roomName: roomFound[0],
        player1: currentRoom.player1.socketId,
        player2: socket.id,
        dificulty: currentRoom.dificulty,
      });
    }
  }

  async startGame(data, server, roomData) {
    const room = roomData.get(data.roomName);
    const roomName = data.roomName;
    const speed = 0.5;
    let time = 20;

    if (!room || !roomName) return;

    if (room.status == 'started') return;

    let signalX = Math.random() > 0.5 ? speed : -speed;
    let signalY = Math.random() > 0.5 ? speed : -speed;

    if (room.dificulty == 'hard') time = 15;
    else if (room.dificulty == 'easy') time = 30;

    await this.userService.setUserStatus(room.player1.id, 'in game');
    room.interval = setInterval(async () => {
      room.status = 'started';
      server.to(data.roomName).emit('gameData', {
        status: 'started',
        ball: room.ball.position,
        player1: room.player1.position,
        player2: room.player2.position,
        score: {
          player1: room.player1.score,
          player2: room.player2.score,
        },
      });

      if ((await this.ballIntersectWall(room.ball.position, signalX)) == 1) {
        signalX *= -1;
      }
      if (
        (await this.ballIntersectPlayer(
          room.player1,
          room.ball.position,
          signalX,
          signalY,
        )) == 1 ||
        (await this.ballIntersectPlayer(
          room.player2,
          room.ball.position,
          signalX,
          signalY,
        )) == 1
      ) {
        signalY *= -1;
      } else if (
        (await this.ballIntersectPlayer(
          room.player1,
          room.ball.position,
          signalX,
          signalY,
        )) == -1 ||
        (await this.ballIntersectPlayer(
          room.player2,
          room.ball.position,
          signalX,
          signalY,
        )) == -1
      ) {
        if (room.ball.position.y > 0) room.player1.score++;
        else if (room.ball.position.y < 0) room.player2.score++;
        await this.resetBall(data.roomName, roomData);
        await this.resetPlayers(data.roomName, roomData);
        if (room.player1.score == 10 || room.player2.score == 10) {
          await this.storeData(room.player1, room.player2);
          server.to(data.roomName).emit('gameOver', {
            status: 'gameOver',
            flag: true,
            player1: room.player1.score,
            player2: room.player2.score,
          });
          room.status = 'gameOver';
          clearInterval(room.interval);
          await this.userService.setUserStatus(
            room.player1.intraName,
            'online',
          );
          await this.userService.setUserStatus(
            room.player2.intraName,
            'online',
          );
          return;
        }
        signalX = Math.random() > 0.5 ? speed : -speed;
        signalY = Math.random() > 0.5 ? speed : -speed;
      }
      room.ball.position.x += signalX;
      room.ball.position.y += signalY;
    }, time);
  }

  async paddleMove(data, server, roomData) {
    const roomName = data.roomName;
    const room = roomData.get(roomName);
    const socketId = data.socketId;
    const right = data.right;
    const left = data.left;
    const w = stage.w / 2 - stage.cRight.args[1] / 2 - player1.size / 2;
    const players = [];

    if (!room || !roomName || !socketId) return;

    if (socketId == room.player1.socketId) {
      if (right && room.player1.position.x + 3 < w)
        room.player1.position.x += 3;
      else if (left && room.player1.position.x - 3 > -w)
        room.player1.position.x -= 3;
      players.push(room.player1.position, room.player2.position);
    } else if (socketId == room.player2.socketId) {
      if (right && room.player2.position.x + 3 < w)
        room.player2.position.x += 3;
      else if (left && room.player2.position.x - 3 > -w)
        room.player2.position.x -= 3;
      players.push(room.player1.position, room.player2.position);
    }
    server.to(roomName).emit('gameData', {
      status: 'started',
      ball: room.ball.position,
      player1: players[0],
      player2: players[1],
      score: {
        player1: room.player1.score,
        player2: room.player2.score,
      },
    });
  }

  async JoinToRoom(data, roomData, socket, server) {
    const roomName = data.roomName;
    const room = roomData.get(data.roomName);
    if (!room || room.status == 'gameOver') return socket.emit('error');
    if (
      room.player1.socketId != socket.id &&
      room.player2.socketId != socket.id &&
      room.player1.intraName != socket.user &&
      room.player2.intraName != socket.user &&
      !room.watchers.includes(socket.id)
    ) {
      room.watchers.push(socket.id);
      socket.join(data.roomName);
      server.to(roomName).emit('watcher', {
        socketId: socket.id,
        roomName,
        watchersRoom: room.watchers,
      });
    }
  }

  async incrementWins(intraName: string): Promise<void> {
    const user = await this.userService.findOne(intraName as unknown as number);
    user.wins++;
    await this.userService.updateSingle(user.id, user);
  }

  async incrementLosses(intraName: string): Promise<void> {
    const user = await this.userService.findOne(intraName as unknown as number);
    user.loss++;
    await this.userService.updateSingle(user.id, user);
  }

  async storeData(player1: any, player2: any): Promise<void> {
    let winner = '';
    let loser = '';
    let score = '';
    if (player1.score > player2.score) {
      await this.incrementWins(player1.intraName);
      await this.incrementLosses(player2.intraName);
      winner = player1.intraName;
      loser = player2.intraName;
      score = player1.score + ' - ' + player2.score;
    } else if (player1.score < player2.score) {
      await this.incrementWins(player2.intraName);
      await this.incrementLosses(player1.intraName);
      winner = player2.intraName;
      loser = player1.intraName;
      score = player2.score + ' - ' + player1.score;
    }
    const user = await this.userService.findOne(winner as unknown as number);
    const user2 = await this.userService.findOne(loser as unknown as number);
    const user1 = this.gameRepository.create({
      status: 'over',
      user: user,
    });
    await this.gameRepository.save(user1);
    await this.historyService.create({
      score1: player1.score,
      score2: player2.score,
      avatar1: user.avatar,
      avatar2: user2.avatar,
      winner: winner,
      loser: loser,
      user: user,
    });
    await this.historyService.create({
      score1: player1.score,
      score2: player2.score,
      avatar1: user.avatar,
      avatar2: user2.avatar,
      winner: winner,
      loser: loser,
      user: user2,
    });
  }

  async getStats(intraName: string): Promise<any> {
    const user = await this.userService.findByUsername(intraName);
    return user;
  }

  async getLeaderboard(): Promise<any> {
    const user = await this.userService.findAll();
    return user;
  }
}
