import { Channel } from "src/channel/entities/channel.entity";
import { Conversation } from "src/conversation/entities/conversation.entity";
import { Users } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    text_message: string;
    @Column()
    createdAt: string;
    @ManyToOne(() => Users, users => users.message)
    @JoinColumn()
    Users: Users;
    @ManyToOne(() => Conversation, conversation => conversation.message,{ cascade: true })
    @JoinColumn()
    conversation: Conversation;
    @ManyToOne(()=>Channel,channel=>channel.message)
    @JoinColumn()
    channel:Channel;
}
