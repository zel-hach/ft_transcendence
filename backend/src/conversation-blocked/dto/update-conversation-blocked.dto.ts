import { PartialType } from '@nestjs/mapped-types';
import { CreateConversationBlockedDto } from './create-conversation-blocked.dto';

export class UpdateConversationBlockedDto extends PartialType(CreateConversationBlockedDto) {}
