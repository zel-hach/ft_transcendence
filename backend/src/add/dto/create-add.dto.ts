import { CreateConversationDto } from "src/conversation/dto/create-conversation.dto";
import { CreateUserDto } from "src/user/dto/create-user.dto";

export class CreateAddDto {

    id: number;
    conversation: CreateConversationDto;
    users: CreateUserDto;
}
