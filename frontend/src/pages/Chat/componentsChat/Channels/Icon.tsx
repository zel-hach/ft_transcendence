import React, { useState } from 'react'
import { RiChatPrivateFill } from "react-icons/ri";
import { TbPasswordUser } from "react-icons/tb";
import { MdPublic } from "react-icons/md";
import Popup from 'reactjs-popup';
import Password from './Password';
import Invite from './Invite';
export default function Icon(props: any) {
    const [isclick1, setIsclick1] = useState<boolean>(false);

    const open = () => {
        setIsclick1(true);
    }
    
    const close = () => {
        props.setIsclick(false);
    }

    const close1 = () => {
        setIsclick1(false);
    }
    
    if (props.channel && props.channel?.mode == 0)
        return (
            <>
                <div onClick={open}>
                    <RiChatPrivateFill size="30" fill="black" />
                    <Popup open={isclick1} closeOnDocumentClick onClose={close1}>
                        <Invite login={props.login} channelid={props.channel.id} channelName={props.channel.channelName} setIsclick1={setIsclick1}></Invite>
                    </Popup>
                </div>
            </>)
    if (props.channel && props.channel?.mode == 1)
        return (<><MdPublic size="30" fill="black" /></>)
    if (props.channel && props.channel?.mode == 2)
        return (<><TbPasswordUser size="30" fill="black" />
            <Popup open={props.isclick}  onClose={close}>
                <Password login={props.login} channelid={props.channel.id} channelName={props.channel.channelName} setIsclick={props.setIsclick} Onchange={props.Onchange} messages={props.messages}> </Password>
            </Popup>
        </>)

}