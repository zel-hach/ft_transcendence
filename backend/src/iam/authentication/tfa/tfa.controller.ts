import {
  Controller,
  Post,
  Res,
  Req,
  UseGuards,
  HttpCode,
  Body,
  UnauthorizedException,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { TfaService } from './tfa.service';
import { UserRequest } from '../interface/user-request.interface';
import { UserService } from 'src/user/user.service';
import { TfaCodeDto } from './dto/tfa-code.dto';
import { AuthenticationService } from '../authentication.service';
import { JwtTfaGuard } from '../guards/jwt-tfa.guard';
import { JwtGuard } from '../guards/jwt.guard';

@Controller('tfa')
@UseInterceptors(ClassSerializerInterceptor)
export class TfaController {
  constructor(
    private readonly tfaService: TfaService,
    private readonly userService: UserService,
    private readonly authService: AuthenticationService,
  ) {}

  @UseGuards(JwtTfaGuard)
  @Post('generate')
  async register(@Res() res: Response, @Req() req: UserRequest) {
    const { otpUri } = await this.tfaService.genTfaSecret(req.user);
    return this.tfaService.pipeQrcodeStream(res, otpUri);
  }

  @UseGuards(JwtTfaGuard)
  @Post('activate')
  @HttpCode(200)
  async activateTfa(@Req() req: UserRequest, @Body() { code }: TfaCodeDto) {
    try {
      if (!req.user.tfaSecret) {
        throw new UnauthorizedException('Please scan the QR code');
      }
      if (!this.tfaService.checkTfaCode(code, req.user)) {
        throw new UnauthorizedException('Wrong code');
      }
      req.user.tfa = true;
      const token = await this.authService.genToken(req.user, true);
      const cookie = `Authentication=${token.accessToken}; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_TTL}`;
      const refresh = `Refresh=${token.refreshToken}; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_TTL}`;
      req.res.setHeader('Set-Cookie', [cookie, refresh]);
      await this.userService.updateSingle(req.user.id, req.user);
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(JwtTfaGuard)
  @Post('deactivate')
  async deactivateTfa(@Req() req: UserRequest) {
    req.user.tfa = false;
    return await this.userService.update(req.user.id, req.user);
  }

  @UseGuards(JwtGuard)
  @Post('authenticate')
  @HttpCode(200)
  async authenticate(@Req() req: UserRequest, @Body() { code }: TfaCodeDto) {
    try {
      const isValid = this.tfaService.checkTfaCode(code, req.user);
      if (!isValid) {
        const cookie = `Authentication=; Path=/; Max-Age=`;
        const refresh = `Refresh=; Path=/; Max-Age=`;
        req.res.setHeader('Set-Cookie', [cookie, refresh]);
        throw new UnauthorizedException('Wrong code');
      }
      const token = await this.authService.genToken(req.user, true);
      const cookie = `Authentication=${token.accessToken}; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_TTL}`;
      const refresh = `Refresh=${token.refreshToken}; Path=/; Max-Age=${process.env.JWT_ACCESS_TOKEN_TTL}`;
      req.res.setHeader('Set-Cookie', [cookie, refresh]);
      return true;
    } catch (err) {
      throw err;
    }
  }
}
