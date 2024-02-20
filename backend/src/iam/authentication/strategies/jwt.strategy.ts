import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import jwtConfig from '../config/jwt.config';
import { TokenPayload } from '../interface/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const tokenFromHeader =
            ExtractJwt.fromAuthHeaderAsBearerToken()(request);
          const tokenFromCookie = request?.cookies?.Authentication;

          return tokenFromHeader || tokenFromCookie;
        },
      ]),
      secretOrKey: jwtConfiguration.secret,
    });
  }

  async validate(payload: TokenPayload) {
    return await this.userService.findOne(payload.sub);
  }
}
