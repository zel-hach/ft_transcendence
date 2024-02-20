import { DataContext } from '@/pages/context';
import { useRouter } from 'next/router';
import React, { useContext, useRef} from 'react'
import { useState } from 'react'

import { IoSend } from "react-icons/io5";


export default function Input(props: any) {
  const [text_message, setMessage] = useState<string>("");
  const {socket,user,token} = useContext(DataContext);
  const navigate = useRouter();
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const currentDate = new Date();
  let conversation:string | null;
  if (typeof window !== 'undefined'){
    conversation = sessionStorage.getItem("conversation");
  }
  const addMessage = async () => {
    try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/conversation/addMessages`,
      {
        method: 'POST',
        credentials:"include",
        headers: {
          
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
  
        },
        body: JSON.stringify({
          senderId: props.login,
          reciveId: props.reciveId,
          text_message,
          createdAt:currentDate.toLocaleString(),
        })
      })
    if (response.ok) {
        const data = await response.json(); 
        if (data !== 0) {
          if (user) {
          if (data != 1)
            await socket?.emit("Conversation",{myid:props.login,userid:props.reciveId})
          const message = {
            Users: user,
            conversation:conversation? JSON.parse(conversation): null,
            text_message: text_message,
            createdAt:currentDate.toLocaleString(),
          }
          await props.setData((prv: any) => [...prv, message]);
        }
      }
    }
    else{
      navigate.push('/');
    }
    await socket?.emit("Message", ({ senderId: props.login, reciveId: props.reciveId, text_message,currentDate:currentDate.toLocaleString()}))

    setMessage('');
    textRef.current?.focus();
  }catch(e){
    console.log(e);
  }
  }

  const changeValue = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }

  return (
    <div className='input'>
      <textarea
        ref={textRef}
        className='inputMessage'
        placeholder='create your message...'
        value={text_message}
        onChange={changeValue}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            addMessage();
          }
        }}
      />
      <IoSend size="58" className="divSend" onClick={addMessage} />
    </div>
  )
}
