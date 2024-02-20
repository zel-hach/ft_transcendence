import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { HashingService } from '../hashing/hashing.service';
import { AuthenticationService } from './authentication.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { JwtTfaGuard } from './guards/jwt-tfa.guard';
import { OauthGuard } from './guards/oauth.guard';
import { UserRequest } from './interface/user-request.interface';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly hashingService: HashingService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(OauthGuard)
  @Get('42')
  async login() {}

  @UseGuards(OauthGuard)
  @Get('42/redirect')
  async callback(@Req() req: UserRequest) {
    const { user } = req;
    const token = await this.authService.genToken(user);
    const hashed_token = await this.hashingService.hash(token.refreshToken);
    user.refresh = hashed_token;
    user.status = 'online';
    this.userService.update(user.id, user);
    const cookie = `Authentication=${token.accessToken}; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_TTL}`;
    const refresh = `Refresh=${token.refreshToken}; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_TTL}`;
    req.res.setHeader('Set-Cookie', [cookie, refresh]);
    if (user.tfa === true) {
      return req.res.redirect(
        `http://${process.env.POSTGRES_HOST}:3000/two-factor-login`,
      );
    }
    return req.res.redirect(
      `http://${process.env.POSTGRES_HOST}:3000/settings`,
    );
  }

  @UseGuards(JwtTfaGuard)
  @Post('logout')
  async logout(@Req() req: UserRequest) {
    const accessCookie = `Authentication=; Path=/; Max-Age=0`;
    const refreshCookie = `Refresh=; Path=; Max-Age=0`;
    req.user.refresh = null;
    req.user.status = 'offline';
    await this.userService.update(req.user.id, req.user);
    req.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Req() req: UserRequest) {
    const token = await this.authService.genToken(req.user);
    const cookie = `Authentication=${token.accessToken}; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_TTL}`;
    req.res.setHeader('Set-Cookie', cookie);
    return req.user;
  }
}
