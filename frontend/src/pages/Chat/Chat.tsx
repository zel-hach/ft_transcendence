import React, { useContext, useEffect, useState } from 'react'
import SidbarDiscution from './componentsChat/SidbarDiscution'
import Messages from './componentsChat/Messages'
import DontHaveMessage from './componentsChat/DontHaveMessage';
import ChannelConv from './componentsChat/Channels/channelConv';
import User from './componentsChat/User';


import Popup from 'reactjs-popup';
import Notification from './componentsChat/Notification';


import { useRouter } from 'next/router';
import { DataContext } from '../context';
import { Layout } from '@/ui/components/layout/layout';
import { Container } from '@/ui/components/container/container';



export default function Chat() {
  const [text, setText] = useState<string>("");
  const [ischannel, setIsChannel] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [conversationId, setConversationid] = useState<string>('');
  const [data, setData] = useState<any[]>([])
  const [friendid, setFriendid] = useState<number>(0);
  const [clickUser, setClickUser] = useState<boolean>(false);
  const [AddUser, setAddUser] = useState<boolean>(false);
  const [createChannel, setCreateChannel] = useState<boolean>(false);
  const [inviteToGame, setInviteTogame] = useState<boolean>(false);
  const [userIngame, setUserinGame] = useState([]);
  const [dataCh, setDataCh] = useState<any[]>([]);
  const [avatar, setAvatar] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const { user, socket, token } = useContext(DataContext);
  const navigate = useRouter();


  const HandleChange = (ischannel: boolean, newValue: string, newName: string, newconversationid: string, newData: any[], userid: number, avatar: string, status: string) => {
    setText(newValue)
    setName(newName)
    setIsChannel(ischannel);
    setConversationid(newconversationid);
    setData(newData);
    setDataCh(newData);
    setFriendid(userid);
    setAvatar(avatar)
    setStatus(status);
  }
  
  useEffect(() => {
    socket?.on("requestToPlay", (data: any) => {
      if (data) {
        setUserinGame(data);
        setInviteTogame(true);
      }
    })
    return () => {
      socket?.off("requestToPlay");
    }
  }, [socket])

  
  const close = () => {
    if (inviteToGame)
      setInviteTogame(false);
  }
  useEffect(()=>{
    if(!token && !user)
    {
      navigate.push('/');
    }
},[token,navigate,user]);
  return (
    <>
    {user && 
    <Layout>
      <Container className="p-20 flex flex-col gap-[150px] ">
          <div className='chat'>
            <SidbarDiscution text={text} setText={setText} login={user?.id}
             Onchange={HandleChange} conversationid={conversationId} setClickUser={setClickUser} 
             clickUser={clickUser} setAddUser={setAddUser} AddUser={AddUser} setCreateChannel={setCreateChannel} createChannel={createChannel}></SidbarDiscution>
            {
              text ?
                <>
                  {
                    ischannel ?
                      <ChannelConv
                        name={name}
                        setText={setText}
                        channelid={conversationId} 
                        login={user?.id} messages={dataCh} setData={setDataCh} ischannel={ischannel} channelName={name}></ChannelConv> :
                      <Messages avatar={avatar} 
                      name={name} status={status} 
                      conversationid={conversationId} 
                      login={user?.id} messages={data} setData={setData} ischannel={ischannel} friendid={friendid}></Messages>
                  }
                </> :
                <>
                  <DontHaveMessage></DontHaveMessage>
                </>
            }
            {
              clickUser && !ischannel &&
              <User login={user?.id} setClickUser={setClickUser} clickUser={clickUser} Onchange={HandleChange}></User>
            }
            {
              <Popup open={inviteToGame} closeOnDocumentClick onClose={close}>
                <Notification setInviteTogame={setInviteTogame} userIngame={userIngame} login={user?.id}></Notification>
              </Popup>
            }
          </div>
      </Container>
    </Layout>

    }
    </>
  )
}
