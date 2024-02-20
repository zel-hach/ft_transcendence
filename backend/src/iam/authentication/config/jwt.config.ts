import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL),
    refreshTokenTttl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL),
  };
});
