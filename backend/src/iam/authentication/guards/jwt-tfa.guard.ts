import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtTfaGuard extends AuthGuard('jwt-tfa') {
  public handleRequest(err: any, user: any, info: Error, ctx: any) {
    if (err || !user) {
      if (info) {
        const httpContext = ctx.switchToHttp();
        const response = httpContext.getResponse();
        const cookie = `Authentication=; Path=/; Max-Age=`;
        const refresh = `Refresh=;  Path=/; Max-Age=`;
        response.setHeader('Set-Cookie', [cookie, refresh]);
        throw new UnauthorizedException();
      }
      throw err;
    }
    return user;
  }
}
