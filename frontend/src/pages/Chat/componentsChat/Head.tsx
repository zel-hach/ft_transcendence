import React, { useContext, useEffect, useState } from 'react'
import Popup from 'reactjs-popup'
import Item from './Items'
import Status from './status';
import { useRouter } from 'next/router';
import { DataContext } from '@/pages/context';
import Image from 'next/image';

export default function Head(props: any) {
  const [blocked, setBlocked] = useState(false);
  const navigate = useRouter();
  const {token} = useContext(DataContext);


  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/conversation/isBlocked/${props.conversationid}/${props.friendid}`,
        {
          credentials:"include",
          headers: {
          
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
    
          }
        })
        if (response.ok) {
          const data = await response.json();
          setBlocked(data.value);
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
  }, [navigate,token,props.friendid,props.conversationid]);

  return (
    <div className='NameUser'>
      <div className='Usr'>
        <div className='en_ligne'>
          <Image src={props.avatar} className='imageProfile' alt='avatar' width={40} height={40}></Image>
          <Status status={props.status}></Status>
        </div>
        <p className='p'>{props.name}</p>
      </div>
      <div className='gotoMenu'>
        <Popup trigger={<Image src='/assets/img/trois-points.png' className='img'alt='popup' width={40} height={40}></Image>} position="left top">
          <Item unblock="unblock" block="block" play="invite to game" viewProfile="view profile" ischannel={props.ischannel} myid={props.myid} friendid={props.friendid} conversationid={props.conversationid} setBlocked={setBlocked} blocked={blocked}></Item>
        </Popup>
      </div>
    </div>
  )
}
