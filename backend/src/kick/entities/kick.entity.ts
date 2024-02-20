
import { Channel } from "src/channel/entities/channel.entity";
import { Users } from "src/user/entities/user.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Kick {
    @PrimaryGeneratedColumn()
    id:number;
    @ManyToOne(()=>Users,users=>users.kicked)
    @JoinColumn({name:"userid"})
    users:Users;
    @ManyToOne(()=>Channel,channel=>channel.kicked)
    @JoinColumn({name:"channelid"})
    channel:Channel;
}
