
import { useContext, useEffect } from 'react'
import React from 'react'
import Newmessage from './NewMessage'
import { DataContext } from '@/pages/context';


export default function Message(props: any) {
  const {socket} = useContext(DataContext);
  useEffect(() => {
    socket?.on("MessageFrom", (data:any) => {
      props.setData((prv: any) => [...prv, data]);
    })

    return () => {
      socket?.off("MessageFrom");
    }
  }, [socket,props])

  return (
    <div className="request">
      {
      props.messages && props.messages.map((src:any,index:number) => {
          return (
              <Newmessage data={src} own={src?.Users.id == props.login} ischannel={props.ischannel} key={index}></Newmessage>
          )
        })
      }
    </div>
  )
}
