import { channel } from "diagnostics_channel";
import { Channel } from "src/channel/entities/channel.entity";
import { Users } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn()
    id:number;
    @ManyToOne(()=>Channel,channel=>channel.admin)
    @JoinColumn()
    channel:Channel;
    @ManyToOne(()=>Users,users=>users.admin)
    @JoinColumn({name:"userid"})
    users:Users;
}
