import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Users } from 'src/user/entities/user.entity';
import { authenticator } from 'otplib';
import { Response } from 'express';
import { toFileStream } from 'qrcode';

@Injectable()
export class TfaService {
  constructor(private readonly userService: UserService) {}

  async genTfaSecret(user: Users) {
    const secret = authenticator.generateSecret();

    const otpUri = authenticator.keyuri(
      user.username,
      process.env.TFA_APP_NAME,
      secret,
    );
    user.tfaSecret = secret;
    await this.userService.updateSingle(user.id, user);
    return { user, otpUri };
  }

  async pipeQrcodeStream(stream: Response, otpUri: string) {
    return await toFileStream(stream, otpUri);
  }

  checkTfaCode(code: string, user: Users) {
    return authenticator.verify({ token: code, secret: user.tfaSecret });
  }
}
