import { Channel } from "src/channel/entities/channel.entity";
import { Users } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Mute {
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    mutedTime:Date;
    @ManyToOne(()=>Users,users=>users.muted)
    @JoinColumn({name:"userid"})
    users:Users;
    @ManyToOne(()=>Channel,channel=>channel.muted)
    @JoinColumn({name:"channelid"})
    channel:Channel;
}
