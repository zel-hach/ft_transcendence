import React, { useContext, useEffect } from 'react'
import Newmessage from '../NewMessage'
import { DataContext } from '@/pages/context';


export default function MessageCh(props:any) {

  const {socket} = useContext(DataContext);
  useEffect(()=>{
    socket?.on("message",(data:any)=>{
      props.setData((prv:any) => [...prv,data]);
    })

    return () =>{
      socket?.off("message");
    }
  },[props,socket])
  
  return (
    <div className="request">
    {
        props.messages && props.messages.map((src:any,index:number)=>{
            return (
                <Newmessage data={src} own={src?.Users.id == props.myuserId} ischannel={props.ischannel} userid={src?.Users.id} myid={props.myuserId} channelid={props.channelid} channelName={props.channelName} key={index}></Newmessage>
              )
        })
    }
    </div>
  )
}
