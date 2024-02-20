import { Admin } from "src/admins/entities/admin.entity";
import { Ban } from "src/ban/entities/ban.entity";
import { Kick } from "src/kick/entities/kick.entity";
import { Message } from "src/message/entities/message.entity";
import { Mute } from "src/mute/entities/mute.entity";
import { Userchannel } from "src/userchannel/entities/userchannel.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    channelOwner:number;
    @Column()
    channelName:string
    @Column()
    password:string
    @Column()
    mode:number
    @OneToMany(()=>Userchannel,userchannel=>userchannel.channel)
    @JoinColumn()
    userChannel:Userchannel[];
    @OneToMany(()=>Message,message=>message.channel)
    @JoinColumn()
    message:Message[];
    @OneToMany(()=>Mute,ban=>ban.channel)
    @JoinColumn()
    muted:Mute[];
    @OneToMany(()=>Ban,ban=>ban.channel)
    @JoinColumn()
    baned:Ban[];
    @OneToMany(()=>Admin,admin=>admin)
    @JoinColumn()
    admin:Admin[];
    @OneToMany(()=>Kick,kick=>kick.channel)
    @JoinColumn()
    kicked:Kick[];
}
