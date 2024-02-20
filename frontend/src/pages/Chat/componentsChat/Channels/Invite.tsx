import React, { useContext, useEffect, useState } from 'react'
import AddFriendTochannel from './AddFriendTochannel';
import { useRouter } from 'next/router';
import { DataContext } from '@/pages/context';

export default function Invite(props: any) {
    const [user, setUser] = useState<any[]>([]);
    const navigate = useRouter();
    const {token} = useContext(DataContext);
    useEffect(() => {
        const getAllUser = () => {
            try{
            fetch(`${process.env.NEXT_PUBLIC_URL}/user`,
            {
                credentials:'include',
                headers: {
          
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
            
                  }
            })
                .then((response) => response.json())
                .then((data) => {
                    setUser(prv => [...prv, ...data]);
                })
            }catch(e){
                navigate.push('/');
                console.log(e);
            }
        }
        getAllUser()
    }, [props.login,token,navigate])

    const findUser = user.filter((u) => {
        return (u.id != props.login);
    })
    return (
        <div className="popUpUser1">
            <input type='search' placeholder='search' className='search'></input>
            <div className='users'>
                {
                    findUser.map((friend,index) => {
                        return (<AddFriendTochannel userid={friend?.id} login={props.login} username={friend?.username} avatar={friend?.avatar} channelid={props.channelid} channelName={props.channelName} setIsclick1={props.setIsclick1} key={index}></AddFriendTochannel>)
                    })
                }
            </div>
        </div>
    )
}
