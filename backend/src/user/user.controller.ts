/* eslint-disable prefer-const */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Users } from './entities/user.entity';
import { FriendshipDto } from 'src/friendship/dto/create-friendship.dto';
import { FriendshipService } from 'src/friendship/friendship.service';
import { FriendsService } from 'src/friends/friends.service';
import { UserRequest } from 'src/iam/authentication/interface/user-request.interface';
import { JwtTfaGuard } from 'src/iam/authentication/guards/jwt-tfa.guard';
import { JwtGuard } from 'src/iam/authentication/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly friendshipService: FriendshipService,
    private readonly friendService: FriendsService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('current')
  showUser(@Req() req: UserRequest) {
    const { user } = req;
    return user;
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(JwtTfaGuard)
  @Post('change-username')
  async setUsername(
    @Req() req: UserRequest,
    @Body() { username }: Partial<CreateUserDto>,
  ) {
    try {
      if ((await this.userService.findByUsername(username)) != null) {
        throw new HttpException(
          'User already exists!',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      let user = await this.userService.findOne(req.user.id);
      user.username = username;
      this.userService.update(user.id, user);
      return user;
    } catch (err) {
      throw new Error(err.msg);
    }
  }

  @Post('update')
  update(@Req() req, @Body() updateUserDto: Partial<Users> | Users) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Post('add-friend')
  async addFriend(@Body() friendshipDto: FriendshipDto) {
    try {
      this.friendshipService.addFriend(friendshipDto);
    } catch (err) {
      throw new Error(err.msg);
    }
  }

  @Get('friends/:id')
  async showFriends(@Param('id') id: number) {
    return this.friendshipService.getFriends(id);
  }

  @Get('other/:id')
  async showOtherUsers(@Param('id') id: number, @Req() req: UserRequest) {
    const noFriends = await this.friendshipService.getNonFriends(req.user.id);
    return noFriends;
  }

  @UseGuards(JwtTfaGuard)
  @Get('achievements/:id')
  async achievements(@Param('id') id: number) {
    try {
      const user = await this.userService.findOne(id);
      if (user.wins === 1 || user.loss == 1) {
        return 1;
      }
      if (user.wins === 5) {
        return 2;
      }
      if (user.loss === 5) {
        return 3;
      }
      return 0;
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(JwtTfaGuard)
  @Delete('friends/:userID/:friendID')
  async removeFriend(
    @Param('userID') userID: number,
    @Param('friendID') friendID: number,
  ) {
    try {
      const getAllFriendship = await this.friendshipService.findAll();
      const getUserFriendships = getAllFriendship.filter((element) => {
        return element.users.id == userID;
      });
      const getFriendID = await getAllFriendship.find((element) => {
        return (
          element.users.id == friendID &&
          getUserFriendships.filter((element2) => {
            return element.friend.id == element2.friend.id;
          })
        );
      });
      const getUser = await getUserFriendships.find(
        (element) => element.friend.id === getFriendID?.friend.id,
      );
      await this.friendshipService.remove(getUser.id);
      await this.friendshipService.remove(getFriendID.id);
      await this.friendService.remove(getUser.friend.id);
      return true;
    } catch (err) {
      throw err;
    }
  }
}
