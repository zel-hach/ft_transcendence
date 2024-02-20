import Image from 'next/image'
import React, { useState } from 'react'
import Popup from 'reactjs-popup'
import UpdatChannel from './UpdatChannel'
export default function HeadCh(props:any) {
  const [click,setClick]=useState<boolean>(false)
  const open = () =>{
    setClick(true);
  }
  const close = () =>{
    setClick(false);
  }
  return (
    <div className='NameUser'>
    <div className='Usr'>
      <p className='p'>{props.name}</p>
    </div>
    <div className='settingChannel'  onClick={open}>
    <Image src='/assets/img/trois-points.png' className='img'alt='popup' width={40} height={40}></Image>
    <Popup open={click} closeOnDocumentClick onClose={close}>
          <UpdatChannel name={props.name} channelid={props.channelid} setClick={setClick}></UpdatChannel>
    </Popup>
    </div>
  </div>
  )
}
