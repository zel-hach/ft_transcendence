import { PartialType } from '@nestjs/mapped-types';
import { FriendshipDto } from './create-friendship.dto';

export class UpdateFriendshipDto extends PartialType(FriendshipDto) {}
