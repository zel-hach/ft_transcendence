import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { UserchannelService } from 'src/userchannel/userchannel.service';
import { Channel } from './entities/channel.entity';
import { Userchannel } from 'src/userchannel/entities/userchannel.entity';
import { Message } from 'src/message/entities/message.entity';
import { MessageService } from 'src/message/message.service';
import { compare, genSalt, hash } from 'bcrypt';
import { BanService } from 'src/ban/ban.service';
import { MuteService } from 'src/mute/mute.service';
import { Ban } from 'src/ban/entities/ban.entity';
import { Mute } from 'src/mute/entities/mute.entity';
import { AdminsService } from 'src/admins/admins.service';
import { Admin } from 'src/admins/entities/admin.entity';
import { UserService } from 'src/user/user.service';
import { kickService } from 'src/kick/kick.service';
import { Kick } from 'src/kick/entities/kick.entity';
import { JwtTfaGuard } from 'src/iam/authentication/guards/jwt-tfa.guard';

@UseGuards(JwtTfaGuard)
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService,
    private readonly userchannelService: UserchannelService,
    private readonly userService: UserService,
    private readonly messageService: MessageService,
    private readonly banService: BanService,
    private readonly muteService: MuteService,
    private readonly adminService: AdminsService,
    private readonly kickService:kickService) { }


  @Post('/')
  async create(@Body() channelparam: any) {
    try {
      if (channelparam.nameCh.length === 0)
        return (0);
      const AllUserChannel = await this.userchannelService.findAll();
      const newUser = await this.userService.findOne(channelparam.userid)

      const channelIsExist = AllUserChannel.find((element) => {
        return (element.channel.channelName === channelparam.nameCh)
      })
      if (channelIsExist) {

        const userinCh = AllUserChannel.find((element) => {
          return (element.users.id == channelparam.userid && element.channel.channelName == channelIsExist.channel.channelName)
        })
        if (userinCh)
        return (0);
      else {
        if (channelIsExist.channel.mode === 1) {
          let newUserChannel: Userchannel = new Userchannel();
          newUserChannel.channel = channelIsExist.channel;
          newUserChannel.users = newUser;
          await this.userchannelService.create(newUserChannel)
        }
        else if (channelIsExist.channel.mode === 2)
        return ('channel is protected can you create password please!');
    }
  }
  else {
        let newChannel: Channel = new Channel();
        const salt = await genSalt();
        newChannel.channelName = channelparam.nameCh;
        newChannel.channelOwner = channelparam.userid;
        newChannel.mode = channelparam.mode;
        newChannel.password = await hash(channelparam.password, salt);
        const nchannel = await this.channelService.create(newChannel)
        let newUserChannel: Userchannel = new Userchannel();
        newUserChannel.channel = nchannel;
        newUserChannel.users = newUser;
        await this.userchannelService.create(newUserChannel);
        return (nchannel);
      }
    } catch (e) {
      console.log(e);
    }
  }
  @Post('/AddMessage')
  async AddMessage(@Body() paramMessage: any) {
    try {
      const AllConversation = await this.userchannelService.findAll();
      const myConversation = AllConversation.filter((element) => { return (element.channel.id == paramMessage.channelid) })
      const allMuted = await this.muteService.findAll();

      const isMuted = allMuted.find((e) => {
        return (e.channel.id == paramMessage.channelid && e.users.id == paramMessage.senderId);
      })
      if (isMuted && new Date(isMuted.mutedTime).getTime() > new Date(paramMessage.createdAt).getTime())
        return (0);
      else {
        if(isMuted)
          this.muteService.remove(isMuted.id);
        const allBaned = await this.banService.findAll();
        const isbaned = allBaned.find((e) => {
          return (e.users.id == paramMessage.senderId && e.channel.id == paramMessage.channelid)
        })
        const allKickedUser = await this.kickService.findAll();
        const isKicked = allKickedUser.find((e)=>{return(e.users.id == paramMessage.senderId && e.channel.id == paramMessage.channelid)})
  
        if (isbaned || isKicked)
          return (0);
        else {
          const check = myConversation.find((element) => {
            return (element.users.id == paramMessage.senderId && element.channel.id == paramMessage.channelid);
          })
          if (!check) {

            const mychannel = myConversation.find((element) => {
              return (element.channel.mode == 1)
            })
            if (mychannel) {
              const mine = await this.userService.findOne(paramMessage.senderId);
              let newUserChannel: Userchannel = new Userchannel();
              newUserChannel.channel = mychannel.channel;
              newUserChannel.users = mine;
              this.userchannelService.create(newUserChannel);
              let message: Message = new Message();
              message.text_message = paramMessage.text_message;
              message.Users = mine;
              message.channel = paramMessage.channelid;
              message.createdAt = paramMessage.createdAt;
              await this.messageService.createRepository(message);
            }
            else
              throw "channel not exist";
          }
          else {
            let message: Message = new Message();
            message.text_message = paramMessage.text_message;
            message.Users = check.users;
            message.channel = paramMessage.channelid;
            message.createdAt = paramMessage.createdAt;
            await this.messageService.createRepository(message);
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  }



  @Get('/getAllMessageCh/:idChannel')
  async getAllMessage(@Param('idChannel') idChannel: number) {
    try {
      const myChannel = await this.messageService.findAllMessage();
      const messages = myChannel.filter((element) => { return (element.channel !== null && element.channel.id == idChannel) })
      return (messages);
    } catch (e) {
      console.log("error display messages: ", e);
    }
  }
  @Post('/invite/')
  async InviteToChannel(@Body() paraminvite: any) {
    try {
      const friend = await this.userService.findOne(paraminvite.friendid);
      const channel = await this.findOne(paraminvite.channelid);

      const allUserChannel = await this.userchannelService.findAll();
      const isExist = allUserChannel.find((e) => {
        return (e.channel.id == paraminvite.channelid && e.users.id == paraminvite.friendid);
      })
      if (isExist)
        return (0);
      const AllAdmin = await this.adminService.findAll();
      const isAdmin = AllAdmin.find((e) => { return (e.users.id == paraminvite.myid && e.channel.id == paraminvite.channelid) });
      if (channel.channelOwner == paraminvite.myid || isAdmin) {
        const allKickedUser = await this.kickService.findAll();
        const isKicked = allKickedUser.find((e)=>{return(e.users.id == paraminvite.friendid && e.channel.id == paraminvite.channelid)})
        if(isKicked)
          this.kickService.remove(isKicked.id);
        const newUserChannel: Userchannel = new Userchannel();
        newUserChannel.channel = channel;
        newUserChannel.users = friend;
        await this.userchannelService.create(newUserChannel);
        return (1);
      }
      else
        return 0;
    } catch (error) {
      console.log(error);
    }
  }

  @Post('/ban')
  async Ban(@Body() user: any) {
    try {
      const userbaned = await this.userService.findOne(user.user.userid);
      const channel = await this.channelService.findOne(user.user.channelid);
      const listBaned = await this.banService.findAll();
      const AllAdmin = await this.adminService.findAll();
      const isAdmin = AllAdmin.find((e) => { return (e.users.id == user.user.myid && e.channel.id == user.user.channelid) });
      if ((channel.channelOwner == user.user.myid || isAdmin) && (channel.channelOwner != user.user.userid)) {
        const isBaned = listBaned.find((e) => { return (e.users.id == user.user.userid && e.channel.id == user.user.channelid) })
        if (isBaned)
          return (isBaned)
        else {
          const allUserChannel = await this.userchannelService.findAll();
          const myChannel = allUserChannel.filter((element) => { return (element.channel.id == user.user.channelid) })
          const userremoved = myChannel.find((element) => { return (element.users.id === user.user.userid) })
          if (userremoved)
            await this.userchannelService.remove(userremoved.id);
          let ban: Ban = new Ban();
          ban.channel = channel;
          ban.users = userbaned;
          await this.banService.create(ban);
          return (1)
        }
      }
      else
        return (0);
    } catch (error) {
      console.log(error);
    }
  }


  @Post('/unban')
  async unban(@Body() user: any) {
    try {
      const userunbaned = await this.userService.findOne(user.user.userid);
      const channel = await this.channelService.findOne(user.user.channelid);
      const listBaned = await this.banService.findAll();
      const AllAdmin = await this.adminService.findAll();
      const isAdmin = AllAdmin.find((e) => { return (e.users.id == user.user.myid && e.channel.id == user.user.channelid) });
      if ((channel.channelOwner == user.user.myid || isAdmin) && (channel.channelOwner != user.user.userid)) {
        const isBaned = listBaned.find((e) => { return (e.users.id == user.user.userid && e.channel.id == user.user.channelid) })
        if (isBaned) {
          await this.banService.remove(isBaned.id);
          let userchannel: Userchannel = new Userchannel();
          userchannel.channel = channel;
          userchannel.users = userunbaned;
          await this.userchannelService.create(userchannel);
          return (1)
        }
      }
      else {
        return (0);
      }
    } catch (e) {
      console.log(e);
    }
  }

  @Get('/isBaned/:idchannel/:userid')
  async isBaned(@Param('idchannel') idchannel: number, @Param('userid') userid: number) {

    try {
      const AllBlocked = await this.banService.findAll();
      const myBlockedCon = AllBlocked.find((e) => {
        return (e.channel.id == idchannel && e.users.id == userid);
      })
      if (myBlockedCon)
        return ({ value: true });
      else
        return ({ value: false });

    } catch (e) {

    }
  }


  @Post('/mute')
  async mute(@Body() user: any) {
    try {
      const muteuser = await this.userService.findOne(user.myparam.userid);
      const channel = await this.channelService.findOne(user.myparam.channelid);
      const listMuted = await this.muteService.findAll();
      const AllAdmin = await this.adminService.findAll();
      const isAdmin = AllAdmin.find((e) => { return (e.users.id == user.myparam.myid && e.channel.id == user.myparam.channelid) });
      if ((channel.channelOwner == user.myparam.myid || isAdmin) && (channel.channelOwner != user.myparam.userid)) {
        const ismuted = listMuted.find((e) => { return (e.users.id == user.myparam.userid && e.channel.id == user.myparam.channelid) })
        if (ismuted)
          return (ismuted)
        else {
          let mute: Mute = new Mute();
          mute.channel = channel;
          mute.users = muteuser;
          mute.mutedTime = user.muteEndTime;
          await this.muteService.create(mute);
          return (1);
        }
      }
      else
        return (0);
    } catch (e) {
      console.log(e);
    }
  }

  @Post('/isMuted')
  async isMuted(@Body() user: any) {
    try {
      const AllMuted = await this.muteService.findAll();
      const myMuteCon = AllMuted.find((e) => {
        return (e.channel.id == user.channelid && e.users.id == user.userid && new Date(e.mutedTime).getTime() > new Date(user.newTime).getTime());
      })
      if (myMuteCon) {
        return ({ value: true });
      }
      else {
        const myMuteCon = AllMuted.find((e) => {
          return (e.channel.id == user.channelid && e.users.id == user.userid);
        })
        if (myMuteCon)
          this.muteService.remove(myMuteCon.id);
        return ({ value: false });
      }

    } catch (e) {
      console.log(e);
    }
  }

  @Post('/admin')

  async setAdmin(@Body() user: any) {
    try {
      const adminuser = await this.userService.findOne(user.myparam.userid);
      const channel = await this.channelService.findOne(user.myparam.channelid);
      const listAdmin = await this.adminService.findAll();
      const AllAdmin = await this.adminService.findAll();
      const isAdmin1 = AllAdmin.find((e) => { return (e.users.id == user.myparam.myid && e.channel.id == user.myparam.channelid) });
      if ((channel.channelOwner == user.myparam.myid || isAdmin1) && (channel.channelOwner != user.myparam.userid)) {
        const isAdmin = listAdmin.find((e) => { return (e.users.id == user.myparam.userid && e.channel.id == user.myparam.channelid) })
        if (isAdmin)
          return (isAdmin)
        else {
          let admin: Admin = new Admin();
          admin.channel = channel;
          admin.users = adminuser;
          await this.adminService.create(admin);
          return (1);
        }
      }
      else
        return (0);
    } catch (e) {
      console.log(e);
    }
  }


  @Post('/unAdmin')
  async unAdmin(@Body() user: any) {
    try {
      const channel = await this.channelService.findOne(user.myparam.channelid);
      const AllAdmin = await this.adminService.findAll();
      const isAdmin1 = AllAdmin.find((e) => { return (e.users.id == user.myparam.myid && e.channel.id == user.myparam.channelid) });
      if ((channel.channelOwner == user.myparam.myid || isAdmin1) && (channel.channelOwner != user.myparam.userid)) {
        const isAdmin = AllAdmin.find((e) => { return (e.users.id == user.myparam.userid && e.channel.id == user.myparam.channelid) })
        if (isAdmin)
          await this.adminService.remove(isAdmin.id);
        return (1);
      }
      else
        return (0)
    } catch (e) {
      console.log(e);
    }
  }


  @Post('kickUser')
  async kickUser(@Body() paramchannel: any) {
    try {
      const channel = await this.channelService.findOne(paramchannel.myparam.channelid);
      const user = await this.userService.findOne(paramchannel.myparam.userid)
      const AllAdmin = await this.adminService.findAll();
      const allKicked = await this.kickService.findAll();
      const isKicked= allKicked.find((e)=>{return(e.users.id == paramchannel.myparam.userid && e.channel.id == paramchannel.myparam.channelid)})
      const isAdmin1 = AllAdmin.find((e) => { return (e.users.id == paramchannel.myparam.myid && e.channel.id == paramchannel.myparam.channelid) });
      const allUserChannel = await this.userchannelService.findAll();
      if ((channel.channelOwner == paramchannel.myparam.myid || isAdmin1) && (channel.channelOwner != paramchannel.myparam.userid)) {
        const userremoved = allUserChannel.find((element) => { return (element.users.id == paramchannel.myparam.userid && element.channel.id == paramchannel.myparam.channelid) })
        if (userremoved && !isKicked) {
          await this.userchannelService.remove(userremoved.id);
          let kickedUser: Kick = new Kick();
          kickedUser.channel = channel;
          kickedUser.users = user;
          await this.kickService.create(kickedUser);
          return (1);
        }
        else
          return (0);
      }
      else
        return(0);
    }
    catch (e) {
      console.log(e);
    }
  }
  @Get('/isAdmin/:idchannel/:userid')
  async isAdmin(@Param('idchannel') idchannel: number, @Param('userid') userid: number) {
    try {
      const AllAdmin = await this.adminService.findAll();
      const admin = AllAdmin.find((e) => {
        return (e.channel.id == idchannel && e.users.id == userid);
      })
      if (admin) {
        return ({ value: true });
      }
      else
        return ({ value: false });

    } catch (e) {
      console.log(e);
    }
  }



  @Post('mychannelP/')
  async ifImInchannel(@Body() myparam: any){
    const AllUserChannel = await this.userchannelService.findAll();
    const user = await this.userService.findOne(myparam.userid);
    const channel = await this.channelService.findOne(myparam.channelid);
    const allBaned = await this.banService.findAll();
    const allKickedUser = await this.kickService.findAll();
    const isKicked = allKickedUser.find((e)=>{return(e.users.id == myparam.userid && e.channel.id == myparam.channelid)})
    if(isKicked && channel.mode == 1)
    { 
      this.kickService.remove(isKicked.id);
      let userchannel: Userchannel = new Userchannel();
      userchannel.channel = channel;
      userchannel.users = user;
      await this.userchannelService.create(userchannel);
    }
    const isBaned = allBaned.find((e) => {
      return (e.users.id == myparam.userid && e.channel.id == myparam.channelid)
    })
    if (isBaned)
      return (0);
    else {
      const mychannel = AllUserChannel.find((e) => { return (e.users.id == myparam.userid && e.channel.id == myparam.channelid) })
      if (mychannel)
        return (1);
      else
        return(2);
    }
  }
  @Post('/protected')
  async protectedChannel(@Body() paramchannel: any) {
    try {
      const friend = await this.userService.findOne(paramchannel.userid);
      const channel = await this.channelService.findOne(paramchannel.channelid);
      const allBaned = await this.banService.findAll();
      const allKickedUser = await this.kickService.findAll();
      const isKicked = allKickedUser.find((e)=>{return(e.users.id == paramchannel.userid && e.channel.id == paramchannel.channelid)})
      const isBaned = allBaned.find((e) => {
        return (e.users.id == paramchannel.userid && e.channel.id == paramchannel.channelid)
      })
      
      if (isBaned)
      return (0);
    else {
      if (await compare(paramchannel.password, channel.password)) {
        if(isKicked)
          this.kickService.remove(isKicked.id);
          const newUserChannel: Userchannel = new Userchannel();
          newUserChannel.channel = channel;
          newUserChannel.users = friend;
          this.userchannelService.create(newUserChannel);
          return { login: "succes", }
        }

        else
          return (0);
      }
    } catch (e) {
      console.log(e);
    }
  }



  @Get('/:userid')
  async getChannel(@Param('userid') id: number) {
    const allChannels = await this.channelService.findAll();
    const AllUserChannel = await this.userchannelService.findAll();
    const myChannel = AllUserChannel.filter((element) => {
      return (element.users.id == id);
    })
    const userChannelIds = myChannel.map((userChannel) => userChannel.channel.id);
    const memberChannels = allChannels.filter((channel) => userChannelIds.includes(channel.id));
    const otherChannels = allChannels.filter((channel) => !userChannelIds.includes(channel.id) && (channel.mode === 1 || channel.mode === 2));
    const resultChannels = [...memberChannels, ...otherChannels];
    return resultChannels;
  }

  @Get("/remove_channel/:channelid/:myid")
  async remove_Channel(@Param('channelid') channelid: number, @Param('myid') myid: number) {
    try {
      const allUserChannel = await this.userchannelService.findAll();
      const myChannel = allUserChannel.find((element) => { return (element.channel.id == channelid && element.users.id == myid) })
      if (myChannel)
        this.userchannelService.remove(myChannel.id);
      else
        throw "you are not in this channel";
    } catch (e) {
      console.log(e);
    }
  }
  @Get('/')
  findAll() {
    return this.channelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.channelService.findOne(+id);
  }
  @Post("changePass")
  async changePass(@Body() channel:any){
    const mychannel = await this.channelService.findOne(channel.channelid);
    if(mychannel && mychannel.channelOwner == channel.userid)
    {
      const salt = await genSalt();
      mychannel.password = await hash(channel.password, salt);
      mychannel.mode= channel.mode;
      return(await this.channelService.update(channel.channelid,mychannel))
    }
    return(mychannel);
  }
}
