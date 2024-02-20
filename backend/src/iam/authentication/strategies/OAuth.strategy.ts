import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthenticationService } from '../authentication.service';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly usersService: UserService,
  ) {
    super({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const userProfile = {
      id: profile._json.id,
      username: profile._json.login,
      accessToken: accessToken,
      refreshToken: refreshToken,
      avatar: profile._json.image.link,
    };

    let user = await this.usersService.findByLogin(userProfile.username);
    if (!user) {
      user = await this.usersService.create({
        id: +userProfile.id,
        login: userProfile.username,
        username: userProfile.username,
        avatar: userProfile.avatar,
        wins: 0,
        loss: 0,
        status: 'online',
        tfa: false,
      });
    }
    return user;
  }
}
