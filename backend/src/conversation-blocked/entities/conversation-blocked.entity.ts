import { Conversation } from "src/conversation/entities/conversation.entity";
import { Users } from "src/user/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ConversationBlocked {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => Conversation, conversation => conversation.blocked)
    @JoinColumn({name:"conversationId"}) 
    conversation: Conversation;
    @ManyToOne(() => Users, user => user.blocked)
    @JoinColumn({name:"userId"})
    users: Users;
}
