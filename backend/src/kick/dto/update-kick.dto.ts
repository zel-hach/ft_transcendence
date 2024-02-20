import { PartialType } from '@nestjs/mapped-types';
import { CreateKickDto } from './create-kick.dto';

export class UpdateKickDto extends PartialType(CreateKickDto) {}
