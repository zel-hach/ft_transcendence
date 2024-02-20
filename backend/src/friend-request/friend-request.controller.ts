import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';

@Controller('friend-request')
export class FriendRequestController {
  constructor(private readonly requestService: FriendRequestService) {}
  @Post('create')
  async addFriendRequest(@Body() requestDto: any) {
    await this.requestService.addFriendRequest(requestDto);
    return true;
  }
  @Get('isrequest/:userId/:receiverId')
  async findReceiver(
    @Param('userId') userId: number,
    @Param('receiverId') receiverId: number,
  ) {
    return await this.requestService.findReceiver(userId, receiverId);
  }

  @Get(':id')
  async getFriendRequests(@Param('id') id: number) {
    return await this.requestService.getRequests(id);
  }

  @Delete(':id')
  async removeRequest(@Param('id') id: number, @Body() requestDto: any) {
    await this.requestService.removeRequest(requestDto.receiverId, id);
    return true;
  }
}
