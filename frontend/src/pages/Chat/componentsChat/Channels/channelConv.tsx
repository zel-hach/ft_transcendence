import React, { useContext, useEffect } from 'react'
import MessageCh from './MessageCh'
import InputCh from './inputCh'
import HeadCh from './HeadCh'
import { DataContext } from '@/pages/context'

export default function ChannelConv(props:any) {
  const {socket} = useContext(DataContext);
  useEffect(() => {
    socket?.on("kick", (data: any) => {
      if (data && data.channelName === props.channelName) {
        props.setText(false);
      }
    })
    return () => {
      socket?.off("kick");
    }
  }, [props,socket])
  return (
    <div className='conversation'>
      <div className='messages'>
          <HeadCh name={props.name}></HeadCh>
          <MessageCh messages={props.messages} myuserId={props.login} ischannel={props.ischannel} channelid={props.channelid} setData={props.setData} channelName={props.channelName}></MessageCh>
          <InputCh myuserId={props.login} mychannelid={props.channelid} channelName={props.channelName}></InputCh>
      </div>
    </div>
  )
}
