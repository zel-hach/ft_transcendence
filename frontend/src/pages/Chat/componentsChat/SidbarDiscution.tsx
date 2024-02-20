import React, { useContext, useEffect, useState } from 'react'
import Popup from 'reactjs-popup'
import Channel from './Channels/Channel'
import Conversation from './Conversation'
import { IoAddCircleSharp } from "react-icons/io5";
import Listchannel from './Channels/Listchannel'
import { FaSearch } from "react-icons/fa";

import { useRouter } from 'next/router';
import { DataContext } from '@/pages/context';

export default function SidbarDiscution(props: any) {
  const [conversation, setConversation] = useState<any[]>([]);
  const [channel, setChannel] = useState<any[]>([]);
  const [isclick1, setIsclick1] = useState<boolean>(false);
  const [inputSearch,setInputSearch] = useState<string>('');
  const {socket,token,user} = useContext(DataContext);
  const navigate = useRouter();
 

 

  const open = () => {
    if (props.clickUser)
      props.setClickUser(false);
    else if (!props.clickUser)
      props.setClickUser(true);
  }
  const opench = () => {
    props.Onchange(true, false ,null, 0,null);
    setIsclick1(true)
  }
  const closech = () => {
    setIsclick1(false);
  }



  useEffect(() => {
    socket?.on("ConversationFrom", (data: any) => {
      setConversation((prv:any) => [...prv, data]);
    })
    return () => {
      socket?.off("ConversationFrom");
    }
  }, [socket])


  useEffect(() => {
    const fetchChannel = async()=>{
    try{
    const response =  await fetch(`${process.env.NEXT_PUBLIC_URL}/channel/${props.login}`,
    {
      credentials:"include",
      headers: {
          
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',

      }
    })
      if (response.ok){
        const data = await response.json();
        setChannel(data);
      }
      else{
        throw "token is empty";
      }
    }catch(e){
      navigate.push('/');
      console.log(e);
    }
  }
  fetchChannel();
  }, [props.login,navigate,token])

  useEffect(() => {
    socket?.on("newChannel", (data: any) => {
      setChannel((prv:any) => [...prv, data]);
    })
    return () => {
      socket?.off("newChannel");
    }
  }, [socket]);

 
  const getFriend =  async () => {
    try{
          const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/conversation/friends/${props.login}`,{
                credentials:"include",
                headers: {
          
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
          
                }
              })
          if(response.ok)
          {
            const data = await response.json();

            setConversation(data);
            return(data);
          }
          else{
            throw new Error("error token");
          }
        }catch(e){
          navigate.push('/');
          console.log(e);
        }
  }
  useEffect( () => {
    getFriend()
   
  }, [props.login,navigate,token])

  const search = async (e: React.ChangeEvent<HTMLInputElement>) =>{
    try{
    setInputSearch(e.target.value);
    e.stopPropagation();
    const user = await getFriend();
    if (e.target.value.trim() === "")
      setConversation(user);
    else
    {
    const filterUser = conversation.filter((conv:any) => {return(conv.users.username.includes(inputSearch))});
    if (filterUser.length != 0)
      setConversation(filterUser);
    else
      setConversation(user);
    }
  }catch(e){
    navigate.push('/');
    console.log(e);
  }
  }
  const outDiscution = (e:any) =>{
    props.setText(false);
  }


  return (
    <div className='sidbar'>
      <div className='search'>
        <div className='searchimg'>
        <FaSearch size="30" fill='gray'/>
        </div>
        <input type='text' placeholder="search" className='searchinput' onChange={search}></input>
      </div>
      <div className="message">
        <div className='directMessage' onClick={outDiscution}>
          <p className='p'>direct messages</p>
          <div onClick={open}>
            <IoAddCircleSharp size="30" fill="black" />
          </div>
        </div>
        <div className='friends'>
          {
            conversation && conversation.map((conversation:any,index:number) => {
              return (
                <Conversation conversation={conversation} Onchange={props.Onchange} login={props.login} key={index}></Conversation>
              )
            })
          }

        </div>
        <div className='channelMessage'>
          <p className='p'>channels</p>
          <div  onClick={opench} >
            <IoAddCircleSharp size="30"  style={{color:"black"}}/>
          </div>
          <Popup open={isclick1} closeOnDocumentClick onClose={closech}>
            <Channel loginid={props.login} setChannel={setChannel} Onchange={props.Onchange} setIsclick1={setIsclick1}></Channel>
          </Popup>
        </div>
        <div className='Channels'>
          {
            channel && channel.map((ch,index) => {
              return (
                <Listchannel setChannel ={setChannel} channels={channel} login={props.login} Onchange={props.Onchange} channel={ch} setAddUser={props.setAddUser} AddUser={props.AddUser} key={index}></Listchannel>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
