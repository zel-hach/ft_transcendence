import { Request } from 'express';
import { Users } from 'src/user/entities/user.entity';

export interface UserRequest extends Request {
  user: Users;
}
