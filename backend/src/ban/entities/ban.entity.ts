
import { Channel } from "src/channel/entities/channel.entity";
import { Users } from "src/user/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ban {
    @PrimaryGeneratedColumn()
    id:number;
    @ManyToOne(()=>Users,users=>users.baned)
    @JoinColumn({name:"userid"})
    users:Users;
    @ManyToOne(()=>Channel,channel=>channel.baned)
    @JoinColumn({name:"channelid"})
    channel:Channel;
}
