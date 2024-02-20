import { Add } from "src/add/entities/add.entity";
import { ConversationBlocked } from "src/conversation-blocked/entities/conversation-blocked.entity";
import { Message } from "src/message/entities/message.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Conversation {
    @PrimaryGeneratedColumn()
    id: number;
    @CreateDateColumn()
    createdAt: Date;
    @OneToMany(() => Message, message => message.conversation)
    @JoinColumn()
    message: Message[];
    @OneToMany(() => Add, add => add.conversation)
    @JoinColumn()
    add: Add[];
    @OneToMany(() => ConversationBlocked, add => add.conversation)
    @JoinColumn()
    blocked: ConversationBlocked[];
}
