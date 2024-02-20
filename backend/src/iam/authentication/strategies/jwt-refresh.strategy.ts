import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigType } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { Request } from 'express';
import { TokenPayload } from '../interface/token-payload.interface';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly authService: AuthenticationService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const tokenFromHeader =
            ExtractJwt.fromAuthHeaderAsBearerToken()(request);
          const tokenFromCookie = request?.cookies?.Refresh;

          return tokenFromHeader || tokenFromCookie;
        },
      ]),
      secretOrKey: jwtConfiguration.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: TokenPayload) {
    const token = req.cookies?.Refresh;
    return await this.authService.checkToken(payload.sub, token);
  }
}
