import { DataContext } from '@/pages/context';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react'
import Popup from 'reactjs-popup';

export default function AddFriendTochannel(props: any) {
    const { socket,token } = useContext(DataContext);
    const [Exist,setExist] = useState<boolean>(false);
    const navigate = useRouter();

    const addToChannel = async (e:React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        props.setIsclick1(false)
        try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/channel/invite/`,
            {
                method: 'POST',
                credentials:"include",
                headers: {
          
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
            
                  },
                body: JSON.stringify({
                    myid: props.login,
                    friendid: props.userid,
                    channelid: props.channelid
                })
            }
        )
        if (response.ok) {
            const data = await response.json();
            if (data == 1)
            {
                await socket?.emit("AddUserToChannel", ({ channelName: props.channelName, friendId: props.userid }));
            }
            else
                setExist(true);
        }
        else{
            navigate.push('/')
        }
    }catch(e){
            
            console.log(e);
        }
    }
    const scrollRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [props.conversation])

    const closech = ()=>{
        setExist(false);
    }
    return (
        <div className="inviteUser" onClick={addToChannel} ref={scrollRef}>
            <Popup open={Exist} closeOnDocumentClick onClose={closech}>
              <div className='notOwner'>
                <p className='notOwnerP'>
                you are not owner or user invited is exist <br></br>
                </p>
              </div>
            </Popup>
            <Image src={props.avatar} className="inviteImage" alt='avatar' width={40} height={40}></Image>
            <p className='textu'>{props.username}</p>
        </div>
    )
}
