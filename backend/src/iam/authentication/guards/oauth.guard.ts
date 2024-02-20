import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OauthGuard extends AuthGuard('42') {
  public handleRequest(err: any, user: any, info: Error, ctx: any) {
    if (err || !user) {
      const httpContext = ctx.switchToHttp();
      const response = httpContext.getResponse();
      response.redirect(`http://${process.env.POSTGRES_HOST}:3001/`);
    }
    return user;
  }
}
