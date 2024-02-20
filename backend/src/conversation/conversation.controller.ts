import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { UserService } from 'src/user/user.service';
import { AddService } from 'src/add/add.service';
import { Conversation } from './entities/conversation.entity';
import { Add } from 'src/add/entities/add.entity';
import { Message } from 'src/message/entities/message.entity';
import { MessageService } from 'src/message/message.service';
import { ConversationBlockedService } from 'src/conversation-blocked/conversation-blocked.service';
import { ConversationBlocked } from 'src/conversation-blocked/entities/conversation-blocked.entity';
import { JwtTfaGuard } from 'src/iam/authentication/guards/jwt-tfa.guard';

@UseGuards(JwtTfaGuard)
@Controller('conversation')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly userService: UserService,
    private readonly addService: AddService,
    private readonly messageService: MessageService,
    private readonly blockedService: ConversationBlockedService,
  ) {}

  @Post('/')
  async create(@Body() addconversation: any) {
    try {
      const usersender = await this.userService.findOne(
        addconversation.senderId,
      );
      const userRecived = await this.userService.findOne(
        addconversation.reciveId,
      );
      const AllConversation = await this.addService.findConversation(
        addconversation.senderId,
      );
      const privateConversation = AllConversation.filter((element) => {
        return element.users.id == addconversation.senderId;
      });
      const ConversationIds = privateConversation.map(
        (element) => element.conversation.id,
      );
      const check = AllConversation.find((element) => {
        return (
          ConversationIds.includes(element.conversation.id) &&
          element.users.id === addconversation.reciveId
        );
      });
      if (check) return check;
      let newconversation: Conversation = new Conversation();
      newconversation = await this.conversationService.create(newconversation);
      let AddConversationS: Add = new Add();
      AddConversationS.users = usersender;
      AddConversationS.conversation = newconversation;
      this.addService.createRepository(AddConversationS);
      let AddConversationR: Add = new Add();
      AddConversationR.users = userRecived;
      AddConversationR.conversation = newconversation;
      this.addService.createRepository(AddConversationR);
      return newconversation;
    } catch (error) {
      console.log('user not found', error);
    }
  }

  @Post('/addMessages')
  async createMessages(@Body() addMessage: any) {
    try {
      const AlladdConversation = await this.addService.findAll();
      const myConv = AlladdConversation.filter((e) => {
        return e.users.id == addMessage.senderId;
      });
      const convIds = myConv.map((e) => e.conversation.id);
      const allBlockedConversation = this.blockedService.findAll();
      const Conv = AlladdConversation.find((e) => {
        return (
          convIds.includes(e.conversation.id) &&
          e.users.id == addMessage.reciveId
        );
      });
      const MyId = AlladdConversation.find((e) => {
        return (
          convIds.includes(e.conversation.id) &&
          e.users.id == addMessage.senderId
        );
      });
      const myBlockedCon = (await allBlockedConversation).find((element) => {
        return element.conversation?.id == Conv.conversation.id;
      });
      if (myBlockedCon) {
        return 0;
      } else {
        let message: Message = new Message();
        if (!Conv || !MyId) {
          const usersender = await this.userService.findOne(
            addMessage.senderId,
          );
          const userRecived = await this.userService.findOne(
            addMessage.reciveId,
          );
          if (userRecived && usersender) {
            let newconversation: Conversation = new Conversation();
            newconversation =
              await this.conversationService.create(newconversation);
            let AddConversationS: Add = new Add();
            AddConversationS.users = usersender;
            AddConversationS.conversation = newconversation;
            await this.addService.createRepository(AddConversationS);
            let AddConversationR: Add = new Add();
            AddConversationR.users = userRecived;
            AddConversationR.conversation = newconversation;
            await this.addService.createRepository(AddConversationR);
            message.Users = usersender;
            message.conversation = newconversation;
            message.text_message = addMessage.text_message;
            message.createdAt = addMessage.createdAt;
            await this.messageService.createRepository(message);
            return newconversation;
          }
        } else {
          message.Users = MyId.users;
          message.conversation = Conv.conversation;
          message.text_message = addMessage.text_message;
          message.createdAt = addMessage.createdAt;
          await this.messageService.createRepository(message);
          return 1;
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  @Get('/getMessage/:friendid/:myid')
  async getMessages1(
    @Body() @Param('friendid', ParseIntPipe) friendid: number,
    @Param('myid') myid: number,
  ) {
    try {
      const AlladdConversation = await this.addService.findAll();
      const myConv = AlladdConversation.filter((e) => {
        return e.users.id == myid;
      });
      const convIds = myConv.map((e) => e.conversation.id);
      const Conv = AlladdConversation.find((e) => {
        return convIds.includes(e.conversation.id) && e.users.id == friendid;
      });
      if (!Conv) return 0;
      const allMessage = await this.messageService.findAllMessage();
      const myMessages = allMessage.filter((element) => {
        return (
          element.conversation !== null &&
          element.conversation.id == Conv.conversation.id
        );
      });
      return myMessages;
    } catch (e) {
      console.log(e);
    }
  }

  @Post('/block')
  async Block(@Body() user: any) {
    try {
      const userRecived = await this.userService.findOne(user.userid);
      const AllConversation = await this.blockedService.findAll();
      const privateConversation = AllConversation.filter((element) => {
        return element.users.id == user.myid;
      });
      const ConversationIds = privateConversation.map(
        (element) => element.conversation.id,
      );
      const check = AllConversation.find((element) => {
        return (
          ConversationIds.includes(element.conversation.id) &&
          element.users.id == user.userid
        );
      });
      if (check) return 0;
      const newconversation = await this.conversationService.findOne(
        user.conversationid,
      );
      if (newconversation && userRecived) {
        let BlockConversation2: ConversationBlocked = new ConversationBlocked();
        BlockConversation2.users = userRecived;
        BlockConversation2.conversation = newconversation;
        await this.blockedService.createRepository(BlockConversation2);
        return 1;
      }
      return 0;
    } catch (error) {
      console.log('user not found', error);
    }
  }

  @Post('/unblock')
  async unblock(@Body() user: any) {
    try {
      const AllConversation = await this.blockedService.findAll();
      const userblocked = AllConversation.find((e) => {
        return (
          e.conversation.id == user.conversationid && e.users.id == user.userid
        );
      });
      if (userblocked) this.blockedService.remove(userblocked.id);
      if (userblocked) return false;
    } catch (e) {
      console.log(e);
    }
  }

  @Get('/isBlocked/:idconversation/:userid')
  async isConversationBlocked(
    @Param('idconversation') idconversation: number,
    @Param('userid') userid: number,
  ) {
    try {
      const AllBlocked = await this.blockedService.findAll();
      const myBlockedCon = AllBlocked.find((e) => {
        return e.conversation.id == idconversation && e.users.id == userid;
      });
      if (myBlockedCon) return { value: true };
      else return { value: false };
    } catch (e) {
      console.log(e);
    }
  }

  @Get('/friends/:iduser')
  async getConversation(@Param('iduser') iduser: number) {
    try {
      const AllConversation = await this.addService.findAll();
      const filterConversation = AllConversation.filter((element) => {
        return element.users.id == iduser;
      });
      const conversationId = filterConversation.map(
        (element) => element.conversation.id,
      );
      const Allconv = AllConversation.filter((element) => {
        return (
          conversationId.includes(element.conversation.id) &&
          element.users.id != iduser
        );
      });
      return Allconv;
    } catch {
      console.log('user not found');
    }
  }
  @Get('/')
  findAll() {
    return this.conversationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.conversationService.findOne(id);
  }
}
