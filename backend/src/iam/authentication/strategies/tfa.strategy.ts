import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { TokenPayload } from '../interface/token-payload.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtTfaStrategy extends PassportStrategy(Strategy, 'jwt-tfa') {
  constructor(
    private readonly userService: UserService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const tokenFromBearer = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
          if (tokenFromBearer) {
            return tokenFromBearer;
          }
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: jwtConfiguration.secret,
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.userService.findOne(payload.sub);
    if (!user.tfa) {
      return user;
    }
    if (payload.tfa) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
