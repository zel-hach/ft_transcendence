import { CreateAddDto } from "src/add/dto/create-add.dto";
import { CreateMessageDto } from "src/message/dto/create-message.dto";

export class CreateConversationDto {
    id: number;
    createdAt: Date;
    message: CreateMessageDto[];
    add: CreateAddDto[];
}
