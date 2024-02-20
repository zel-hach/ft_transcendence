import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { HistoryService } from './history.service';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from 'src/iam/authentication/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('history')
export class HistoryController {
  constructor(
    private readonly historyService: HistoryService,
    private readonly userService: UserService,
  ) {}

  @Get()
  findAll() {
    return this.historyService.findAll();
  }

  @Get(':id')
  async userHistory(@Param('id') id: string) {
    const getHistory = await this.historyService.findAll();
    const getMyUser = getHistory.filter((element) => {
      return element.user.id == +id;
    });
    return getMyUser;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historyService.remove(+id);
  }
}
