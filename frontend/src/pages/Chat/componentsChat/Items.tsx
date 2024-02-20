
import React, { useContext, useEffect, useState } from 'react';

import Popup from 'reactjs-popup';
import { useRouter } from 'next/router';
import { DataContext } from '@/pages/context';
import Link from "next/link";

export default function Item(props: any) {
  const [muted, setMuted] = useState(false);
  const [baned, setBaned] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [timeMuted, setTimeMuted] = useState(0);
  const { socket, token } = useContext(DataContext);
  const [isClick, setIsClick] = useState(false);

  const navigate = useRouter();
  useEffect(() => {
    if (!token)
      navigate.push('/')
  }, [navigate,token])

 
    useEffect(() => {
      if(props.ischannel){
      const fetchdata = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/channel/isBaned/${props.userInfo.channelid}/${props.userInfo.userid}`,
            {
              credentials: "include",
              headers: {

                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',

              }
            })
          if (response.ok) {
            const data = await response.json();
            setBaned(data.value);
          }
          else
            throw "error fetch data";
        }
        catch (e) {
          navigate.push('/');
          console.log(e);
        }
      }
      fetchdata();
    }
    }, [navigate,token,props]);
    useEffect(() => {
      if(props.ischannel)
      {
      const fetchdata = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/channel/isMuted`,
            {
              method: "POST",
              credentials: "include",
              headers: {

                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',

              },
              body: JSON.stringify({
                channelid: props.userInfo.channelid,
                userid: props.userInfo.userid,
                newTime: new Date().toISOString(),
              })
            })
          if (response.ok) {
            const data = await response.json();
            setMuted(data.value);
          }
          else
            throw "error fetch data";
        }
        catch (e) {
          navigate.push('/');
          console.log(e);
        }
      }
      fetchdata();
    }
    }, [navigate,token,props]);


    useEffect(() => {
      if(props.ischannel)
      {
      const fetchdata = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/channel/isAdmin/${props.userInfo.channelid}/${props.userInfo.userid}`,
            {
              credentials: "include",
              headers: {

                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',

              }
            })
          if (response.ok) {
            const data = await response.json();
            setIsAdmin(data.value);
          }
          else
            throw "error fetch data";
        }
        catch (e) {
          navigate.push('/');
          console.log(e);
        }
      }
      fetchdata();
    }
    }, [navigate,token,props]);

    useEffect(() => {
      if(!props.ischannel)
      {
      const fetchdata = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/conversation/isBlocked/${props.conversationid}/${props.friendid}`,
            {
              credentials: "include",
              headers: {

                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',

              }
            })
          if (response.ok) {
            const data = await response.json();
            props.setBlocked(data.value);
          }
          else
            throw "error fetch data";
        }
        catch (e) {
          navigate.push('/');
          console.log(e);
        }
      }
      fetchdata();
    }
    }, [navigate,token,props]);
  
  const closech = () => {
    setIsClick(false);
  }

  const blockFriend = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_URL}/conversation/block`, {
        method: "POST",
        credentials: "include",
        headers: {

          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          userid: props.friendid,
          myid: props.myid,
          conversationid: props.conversationid
        })
      });
      props.setBlocked(true);
    } catch (e) {
      navigate.push('/');
      console.log(e);
    }
  }

  const unblockFriend = () => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_URL}/conversation/unblock`, {
        method: "POST",
        credentials: "include",
        headers: {

          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          userid: props.friendid,
          myid: props.myid,
          conversationid: props.conversationid
        })
      });
      props.setBlocked(false);
    } catch (e) {
      navigate.push('/');
      console.log(e);
    }
  }



  const goToPlay = () => {
    socket?.emit("inviteTogame", { userid: props.friendid, myid: props.myid });
  }
  const MuteFriend = () => {
    const currentTime = new Date();
    const muteEndTime = new Date(currentTime.getTime() + timeMuted * 60000);
    try {
      fetch(`${process.env.NEXT_PUBLIC_URL}/channel/mute`, {
        method: "POST",
        credentials: "include",
        headers: {

          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          myparam: props.userInfo,
          muteEndTime: muteEndTime,
        })
      }).then((response) => response.json()).
        then((data) => {
          if (data == 0)
            setIsClick(true);
          else
            setMuted(true);
        })
    } catch (e) {
      navigate.push('/');
      console.log(e);
    }
  }


  const userAsAdmin = () => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_URL}/channel/admin`, {
        method: "POST",
        credentials: "include",
        headers: {

          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          myparam: props.userInfo,
        })
      })
        .then((response) => response.json()).
        then((data) => {
          if (data == 0)
            setIsClick(true);
          else
            setIsAdmin(true);

        })
    }
    catch (e) {
      navigate.push('/');
      console.log(e);
    }
  }

  const userAdmin = () => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_URL}/channel/unAdmin`, {
        method: "POST",
        credentials: "include",
        headers: {

          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          myparam: props.userInfo,
        })
      }).then((response) => response.json()).
        then((data) => {
          if (data == 0)
            setIsClick(true);
          else
            setIsAdmin(false);
        })
    } catch (e) {
      navigate.push('/');
      console.log(e);
    }
  }

  const BanFriend = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_URL}/channel/ban`, {
        method: "POST",
        credentials: "include",
        headers: {

          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          user: props.userInfo,
        })
      }).then((response) => response.json()).
        then((data) => {
          if (data == 0)
            setIsClick(true);
          else
            setBaned(true);
        })
    } catch (e) {
      navigate.push('/');
      console.log(e);
    }
    await socket?.emit("ban_kick", ({ user: props.userInfo.userid, channelName: props.channelName }));

  }

  const unBanFriend = () => {
    try {
      fetch(`${process.env.NEXT_PUBLIC_URL}/channel/unban`, {
        method: "POST",
        credentials: "include",
        headers: {

          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          user: props.userInfo,
        })
      }).then((response) => response.json()).
        then((data) => {
          if (data == 0)
            setIsClick(true);
          else
            setBaned(false);
        })
    } catch (e) {
      navigate.push('/');
      console.log(e);
    }
  }

  const kickFriend = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_URL}/channel/kickUser`, {
        method: "POST",
        credentials: "include",
        headers: {

          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          myparam: props.userInfo,
        })
      }).then((response) => response.json())
        .then((data) => {
          if (data == 0)
            setIsClick(true);
        })
    } catch (e) {
      navigate.push('/');
      console.log(e);
    }
    await socket?.emit("ban_kick", ({ user: props.userInfo.userid, channelName: props.channelName }));
  }

  return (
    <div className='goto'>
      {
        !props.ischannel ?
          <>
            <p onClick={props.blocked ? unblockFriend : blockFriend} className='click block'>
              {props.blocked ? props.unblock : props.block}
            </p>
            <Link href={`http://${process.env.NEXT_PUBLIC_HOST}:3000/profile/${props.friendid}`}><p className='click viewProfile'>{props.viewProfile}</p></Link>
            <p onClick={goToPlay} className='click play'>{props.play}</p>
          </> :
          <>
            <Popup open={isClick} closeOnDocumentClick onClose={closech}>
              <div className='notOwner'>
                <p className='notOwnerP'>
                  you are not owner or admin or <br></br>
                  you havent permession for ban,mute or kick the owner
                </p>
              </div>
            </Popup>
            {baned ?
              <p onClick={unBanFriend} className='click ban'>{props.menu.unbaned}</p> :
              <p onClick={BanFriend} className='click ban'>{props.menu.ban}</p>
            }
            {
              muted ?
                <p className='click mute'>{props.menu.unmute}</p> :
                <div className='inputMute'>
                  <p className='click mute' onClick={MuteFriend}>{props.menu.mute}</p>
                  <input type="number" className='textInput' min="1" onChange={(e: any) => { setTimeMuted(e.target.value) }}></input>
                </div>
            }
            {
              !isAdmin ?
                <p onClick={userAsAdmin} className='click mute'>{props.menu.Setadmin}</p> :
                <p onClick={userAdmin} className='click mute'>{props.menu.admin}</p>
            }
            <p onClick={kickFriend} className='click kick'>{props.menu.kick}</p>
            <Link href={`http://${process.env.NEXT_PUBLIC_HOST}:3000/profile/${props.userInfo.userid}`}><p className='click viewProfile'>{props.menu.viewProfile}</p></Link>
          </>
      }
    </div>
  );
}
