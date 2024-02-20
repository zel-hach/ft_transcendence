import { Channel } from "src/channel/entities/channel.entity";
import { Users } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Userchannel {
    @PrimaryGeneratedColumn()
    id:number;
    @ManyToOne(()=>Users,users=>users.userChannel)
    @JoinColumn({name:"userid"})
    users:Users;
    @ManyToOne(()=>Channel,channel=>channel.userChannel)
    @JoinColumn({name:"channelid"})
    channel:Channel;
}
