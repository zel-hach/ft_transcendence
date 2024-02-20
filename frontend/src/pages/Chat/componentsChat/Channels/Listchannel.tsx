import React, { useContext, useEffect, useRef, useState } from 'react'
import Icon from './Icon';
import { IoIosRemoveCircle } from "react-icons/io";
import { DataContext } from '@/pages/context';
import { useRouter } from 'next/router';


export default function Listchannel(props: any) {
  const [isclick, setIsclick] = useState(false);
  const { socket,token } = useContext(DataContext);
  const [message, setMessage] = useState([]);
  const navigate = useRouter()

  const afficherMessage = async () => {
    try{
    return (await fetch(`${process.env.NEXT_PUBLIC_URL}/channel/getAllMessageCh/${props.channel.id}`, {
      credentials: "include",
      headers: {
          
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',

      }
    })
      .then(reponse => reponse.json())
      .then((data) => {
        return (data);
      })
    )
    }catch(e){
      navigate.push('/');
      console.log(e);
    }
  }



  const goToDiscussion = async (e:React.FormEvent) => {
    try{
    e.stopPropagation();
      const oldChannel = sessionStorage.getItem("oldChannel");
      if (oldChannel != props.channel?.channelName) {
        socket?.emit("leaveRoom", (oldChannel));
        sessionStorage.setItem("oldChannel", props.channel?.channelName);
      }
      socket?.emit("joinRoom", (props.channel?.channelName));
      const messages = await afficherMessage();
      setMessage(messages);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/channel/mychannelP/`, {
        method: "POST",
        credentials: "include",
        headers: {
          
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
  
        },
        body: JSON.stringify({
          userid: props.login,
          channelid: props.channel?.id,
        })
      })
      if (response.ok) {
        const responseBody = await response.json();
        if (responseBody == 1) {
          if(props.channel.mode == 2)
            setIsclick(false)
            props.setAddUser(false);
            props.Onchange(true, true, props.channel?.channelName, props.channel?.id, messages);
        }
        else if (responseBody == 0){
        if (props.channel.mode == 2) {
            props.Onchange(true, false, props.channel?.channelName, props.channel?.id, messages);
            setIsclick(true)
          }
          else {
            props.Onchange(true, false, props.channel?.channelName, props.channel?.id, messages);
          }
        }
        else
        {
          if (props.channel.mode == 0)
            props.Onchange(true, false, props.channel?.channelName, props.channel?.id, messages);
          else if (props.channel.mode == 2) {
            props.Onchange(true, false, props.channel?.channelName, props.channel?.id, messages);
            setIsclick(true)
          }
          else
            props.Onchange(true, true, props.channel?.channelName, props.channel?.id, messages);
        }
      }
      else{
        navigate.push('/');
      }
    }catch(e){
      console.log(e);
    }
  }
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.conversation])

  const remove_Channel = (e: any) => {
    e.stopPropagation();
    try{
    fetch(`${process.env.NEXT_PUBLIC_URL}/channel/remove_channel/${props.channel?.id}/${props.login}`, {
      credentials: "include",
      headers: {
          
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',

      }
    });
    const filterchannel = props.channels.filter((ch: any) => {
      return (ch.id != props.channel?.id)
    })
    props.setChannel(filterchannel);
  }catch(e){
    navigate.push('/');
    console.log(e);
  }
  }

  return (
    <div className='channel' onClick={goToDiscussion}>
      <div className='newMessage' >
        {
          props.channel &&
          <span className='SpanUser'>{props.channel.channelName}</span>
        }
      </div>
      <div className='icons_remove'>
        <div onClick={remove_Channel}>
          <IoIosRemoveCircle fill="red" size="20" />
        </div>
        <Icon login={props.login} isclick={isclick} setIsclick={setIsclick} setAddUser={props.setAddUser} AddUser={props.AddUser} channel={props.channel} Onchange={props.Onchange} messages={message}></Icon>
      </div>
    </div>
  )
}
