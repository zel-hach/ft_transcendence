
import { DataContext } from '@/pages/context';
import React, { useContext, useRef, useState } from 'react'
import { IoSend } from "react-icons/io5";



export default function InputCh(props:any) {
    const {socket,token} = useContext(DataContext);
    const [text_message,setTextMessage] = useState<string>("");
    const textRef = useRef<HTMLTextAreaElement | null>(null);
    const currentDate = new Date();
    const addMessage = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_URL}/channel/AddMessage`,
        {
            method:"POST",
            headers: {
          
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
        
              },
            credentials:"include",
            body:JSON.stringify({
                senderId: props.myuserId,
                channelid:props.mychannelid,
                text_message,
                createdAt:currentDate.toLocaleString(),
            })
        })
    await socket?.emit("messagetoRoom",{ sender: props.myuserId , message: text_message,currentDate:currentDate.toLocaleString(), room: props.channelName,channelid:props.mychannelid})
    setTextMessage('');
    }
    return (
        <div className='input'>
            <textarea 
            ref={textRef}
            className='inputMessage' placeholder='create your message...'
                value={text_message}
                onChange={e => setTextMessage(e.target.value)}
                onKeyUp={(e)=>{
                    if(e.key == 'Enter')
                    addMessage();
                }}></textarea>
             <IoSend size="58"  className="divSend" onClick={addMessage}/>
        </div>
    )
}
