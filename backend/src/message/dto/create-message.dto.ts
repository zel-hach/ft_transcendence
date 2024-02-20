import { CreateConversationDto } from "src/conversation/dto/create-conversation.dto";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export class CreateMessageDto {
    id:             number;
    text_message:   string;
    createdAt: string;
    Users:          CreateUserDto;
    conversation:   CreateConversationDto;
}
