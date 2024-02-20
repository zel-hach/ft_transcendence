import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friend-request.entity';
import { UserService } from 'src/user/user.service';
import { RequestService } from 'src/request/request.service';
import { FindOneOptions, Repository } from 'typeorm';
import { FriendshipService } from 'src/friendship/friendship.service';
import { RequestSend } from 'src/request/entities/request.entity';

@Injectable()
export class FriendRequestService {
  constructor(
    private readonly userService: UserService,
    private readonly requestService: RequestService,
    private readonly friendshipService: FriendshipService,
    @InjectRepository(FriendRequest)
    private requestRepository: Repository<FriendRequest>,
  ) {}

  async create(createRequestDto: FriendRequest) {
    const newRequest = await this.requestRepository.create(createRequestDto);
    await this.requestRepository.save(newRequest);
    return newRequest;
  }

  findAll() {
    return this.requestRepository.find({ relations: ['sender', 'request'] });
  }

  async remove(id: number) {
    const options: FindOneOptions<FriendRequest> = { where: { id: id } };
    const user = await this.requestRepository.findOne(options);
    return this.requestRepository.remove(user);
  }

  async getRequests(userId: number) {
    try {
      const getAllFriendRequest = await this.findAll();
      const getUserFriendRequest = await getAllFriendRequest.filter(
        (element) => {
          return element.sender.id == userId;
        },
      );
      const getRequestId = await getUserFriendRequest.map(
        (element) => element.request.id,
      );
      const getUserRequests = await getAllFriendRequest
        .filter((element) => {
          return (
            getRequestId.includes(element.request.id) &&
            element.sender.id != userId
          );
        })
        .map((element) => element.sender);
      return getUserRequests;
    } catch (err) {
      throw err;
    }
  }

  async findReceiver(userId: number, receiverId: number) {
    try {
      const getRequests = await this.getRequests(userId);
      if (
        getRequests &&
        getRequests.find((element) => element.id == receiverId)
      ) {
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }

  async removeRequest(userId: number, requestId: number) {
    try {
      const getAllFriendRequest = await this.findAll();
      const getUserFriendRequest = getAllFriendRequest.filter((element) => {
        return element.sender.id == userId;
      });
      const getRequestId = getAllFriendRequest.find((element) => {
        return (
          element.sender.id == requestId &&
          getUserFriendRequest.filter((element2) => {
            return element.request.id == element2.request.id;
          })
        );
      });
      const getUser = await getUserFriendRequest.find(
        (element) => element.request.id === getRequestId?.request.id,
      );
      await this.remove(getUser.id);
      await this.remove(getRequestId.id);
      await this.requestService.remove(getUser.request.id);
    } catch (err) {
      throw err;
    }
  }

  async addFriendRequest(requestDto: any) {
    try {
      const getFriends = await this.friendshipService.getFriends(
        requestDto.senderId,
      );
      if (getFriends.includes(requestDto.receiverId)) {
        return;
      }
      const user1 = await this.userService.findOne(requestDto.senderId);
      const user2 = await this.userService.findOne(requestDto.receiverId);
      const allFriendRequests = await this.findAll();
      const allUsers = await allFriendRequests.filter((request) => {
        return request.sender.id === requestDto.senderId;
      });
      const allRequests = await allUsers.map((element) => element.request.id);
      const check = await allFriendRequests.find((element) => {
        return (
          allRequests.includes(element.request.id) &&
          element.sender.id === requestDto.userId2
        );
      });
      if (check) {
        return check;
      }
      const newRequest: RequestSend = new RequestSend();
      const nrequest = await this.requestService.create(newRequest);
      const friendRequest1: FriendRequest = new FriendRequest();
      friendRequest1.sender = user1;
      friendRequest1.request = nrequest;
      const friendRequest2: FriendRequest = new FriendRequest();
      friendRequest2.sender = user2;
      friendRequest2.request = nrequest;
      this.create(friendRequest1);
      this.create(friendRequest2);
    } catch (err) {
      throw err;
    }
  }

  async getNotSent(userId: number) {
    const getUsers = await this.userService.findAll();
    const getRequests = await this.getRequests(userId);
    const getUsersId = getRequests.map((element) => element.id);
    const getNonSent = getUsers.filter((element) => {
      return !getUsersId.includes(element.id) && element.id != userId;
    });
    return getNonSent;
  }
}
