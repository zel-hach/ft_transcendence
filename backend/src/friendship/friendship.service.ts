import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FriendshipDto } from './dto/create-friendship.dto';
import { Repository } from 'typeorm';
import { Friendship } from './entities/friendship.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Friend } from 'src/friends/entities/friend.entity';
import { FriendsService } from 'src/friends/friends.service';

@Injectable()
export class FriendshipService {
  constructor(
    private readonly userService: UserService,
    private readonly friendService: FriendsService,
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
  ) {}

  async create(createFriendshipDto: Friendship) {
    const newFriendship =
      await this.friendshipRepository.create(createFriendshipDto);
    await this.friendshipRepository.save(newFriendship);
    return newFriendship;
  }

  findAll() {
    return this.friendshipRepository.find({ relations: ['users', 'friend'] });
  }

  async findMyUser(id: number) {
    const getAllFriendship = await this.findAll();
    const getUserFriendship = await getAllFriendship.filter((element) => {
      return element.users.id == id;
    });
    const getFriendsId = await getUserFriendship.map(
      (element) => element.friend.id,
    );
    return [getAllFriendship, getFriendsId];
  }

  async remove(id: number) {
    const deleted = await this.friendshipRepository.delete(id);
    if (!deleted.affected)
      throw new HttpException('Friendship not found', HttpStatus.NOT_FOUND);
  }

  async addFriend(friendshipDto: FriendshipDto) {
    const user1 = await this.userService.findOne(friendshipDto.userId1);
    const user2 = await this.userService.findOne(friendshipDto.userId2);
    const allFriendship = await this.findAll();
    const allUsers = await allFriendship.filter((friendship) => {
      return friendship.users.id === friendshipDto.userId1;
    });
    const allFriends = await allUsers.map((element) => element.friend.id);
    const check = await allFriendship.find((element) => {
      return (
        allFriends.includes(element.friend.id) &&
        element.users.id === friendshipDto.userId2
      );
    });
    if (check) {
      return check;
    }
    const newFriend: Friend = new Friend();
    const nfriend = await this.friendService.create(newFriend);
    const friendship1: Friendship = new Friendship();
    friendship1.users = user1;
    friendship1.friend = nfriend;
    const friendship2: Friendship = new Friendship();
    friendship2.users = user2;
    friendship2.friend = nfriend;
    this.create(friendship1);
    this.create(friendship2);
  }

  async getFriends(userId: number) {
    const getAllFriendship = await this.findAll();
    const getUserFriendship = await getAllFriendship.filter((element) => {
      return element.users.id == userId;
    });
    const getFriendsId = await getUserFriendship.map(
      (element) => element.friend.id,
    );
    const getUserFriends = await getAllFriendship
      .filter((element) => {
        return (
          getFriendsId.includes(element.friend.id) && element.users.id != userId
        );
      })
      .map((element) => element.users);
    return getUserFriends;
  }

  async getNonFriends(userId: number) {
    const getUsers = await this.userService.findAll();
    const getFriends = await this.getFriends(userId);
    const getUsersId = getFriends.map((element) => element.id);
    const getNonFriends = getUsers.filter((element) => {
      return !getUsersId.includes(element.id) && element.id != userId;
    });
    return getNonFriends;
  }
}
