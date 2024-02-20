import { Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationService } from './authentication/authentication.service';
import { UserModule } from 'src/user/user.module';
import { AuthenticationController } from './authentication/authentication.controller';
import { OauthStrategy } from './authentication/strategies/OAuth.strategy';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './authentication/config/jwt.config';
import { JwtStrategy } from './authentication/strategies/jwt.strategy';
import { TfaController } from './authentication/tfa/tfa.controller';
import { TfaService } from './authentication/tfa/tfa.service';
import { JwtRefreshStrategy } from './authentication/strategies/jwt-refresh.strategy';
import { JwtTfaStrategy } from './authentication/strategies/tfa.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthenticationService,
    OauthStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtTfaStrategy,
    TfaService,
  ],
  controllers: [AuthenticationController, TfaController],
})
export class IamModule {}
