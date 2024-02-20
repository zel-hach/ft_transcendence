import { DataContext } from '@/pages/context';
import { socket } from '@/service/socket';
import React, { useContext } from 'react'

export default function Notification(props: any) {
   const {socket} = useContext(DataContext)
    const refuse = (e:React.FormEvent) => {
        e.stopPropagation();
        props.setInviteTogame(false);
    }
    const accept = (e:React.FormEvent) => {
        e.stopPropagation();
        props.setInviteTogame(false);
       socket?.emit("joinPrivateGame",{roomName:props.userIngame.roomName,type:"accept"})
    }
    return (
        <div className='inviteTogame'>
            <p className='pInviteTogame'>invite to play with: <span className='spanIn'>{props.userIngame?.username}</span>  </p>
            <div className='buttons'>
                <input type='button' value='refuse' className="click refuse" onClick={refuse}></input>
                <input type='button' value='accept' className="click accept" onClick={accept}></input>
            </div>
        </div>
    )
}
