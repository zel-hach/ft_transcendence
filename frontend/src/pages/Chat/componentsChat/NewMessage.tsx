import React, { useEffect, useRef } from 'react'
import profile from './../../../../public/assets/img/imgprofile.jpeg'
import Popup from 'reactjs-popup';
import Item from './Items';
import Image from 'next/image';

export default function Newmessage(props: any) {
  const userInfo = {
    myid:props.myid,
    userid:props.userid,
    channelid:props.channelid
  }
  const menu ={
    ban :"ban",
    mute:"mute",
    viewProfile:"view profile",
    kick:"kick",
    unbaned:"unban",
    unmute:"unmute",
    Setadmin:"set as admin",
    admin:"set as user"
  }
  
  const date = new Date(props.data?.createdAt);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.data])
  if (props.data?.text_message.trim().length !== 0) {    
    return (
      <div className={props.own ? "Mymessage" : "messagesUser"} >
        <div className="message">
        {
          props.ischannel ?
          <Popup trigger={<Image src={props.data?.Users.avatar} className='img' alt="popup" width={40} height={40}></Image>} position="left top">
          <Item  ischannel={props.ischannel} userInfo={userInfo}  menu={menu} channelName={props.channelName}></Item>
          </Popup>:
          <Image src={props.data?.Users.avatar} className='img' alt="avatar" width={40} height={40}></Image>
        }
        <div className='newMsg' ref={scrollRef}>
          {props.data?.text_message}
        </div>
        </div>
        <p className='time'>{date.toLocaleTimeString()}</p>
      </div>
    )
  }
}