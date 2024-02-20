import { Conversation } from "src/conversation/entities/conversation.entity";
import { Users } from "src/user/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Add { 
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Conversation, conversation => conversation.add)
    @JoinColumn({name:"conversationId"}) 
    conversation: Conversation;
    @ManyToOne(() => Users, user => user.add)
    @JoinColumn({name:"userId"})
    users: Users;
    
}
