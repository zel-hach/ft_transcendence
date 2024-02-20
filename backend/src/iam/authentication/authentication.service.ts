import { Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { Users } from 'src/user/entities/user.entity';
import { TokenPayload } from './interface/token-payload.interface';
import { HashingService } from '../hashing/hashing.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async signToken(payload: TokenPayload, tfa: boolean) {
    return await this.jwtService.signAsync(
      {
        sub: payload.sub,
        username: payload.username,
        tfa: tfa,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );
  }

  async genToken(user: Users, tfa = false) {
    const payload: TokenPayload = {
      sub: user.id,
      username: user.username,
      tfa: tfa,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(payload, tfa),
      this.signToken(payload, tfa),
    ]);
    return { accessToken, refreshToken };
  }

  async checkToken(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    const isSame = await this.hashingService.compare(
      refreshToken,
      user.refresh,
    );
    if (isSame) {
      return user;
    }
  }
}
