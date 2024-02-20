import { DataContext } from '@/pages/context';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useRef, useState } from 'react'

export default function AddFriend(props: any) {
    const [data, setData] = useState<any[]>([])
    const navigate = useRouter();
    const {token,user} = useContext(DataContext)
    useEffect(() => {
        const afficherMessage = () => {
            try{
            fetch(`${process.env.NEXT_PUBLIC_URL}/conversation/getMessage/${props.userid}/${props.login}`,
            {
                credentials:"include",
                headers: {
              
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
            
                  }
            })
                .then(reponse => reponse.json())
                .then((data) => {
                    if (data) {
                        setData((prv: any) => [...prv, ...data]);
                    }
                });
            }catch(e){
                navigate.push('/');
                console.log(e);
            }
        }
        afficherMessage();
    },[props.login,props.userid,navigate,token]);

    const addConversation = async (e: any) => {
        props.Onchange(false, true, props.username, 0, data, props.userid,props.avatar,props.status);
        props.setClickUser(false);
    }
    const scrollRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [props.conversation])

    return (
        <div className="inviteUser" onClick={addConversation} ref={scrollRef}>
            <Image src={props.avatar} className='inviteImage' alt='avatar' width={40} height={40}></Image>
            <p className='textu'>{props.username}</p>
        </div>
    )
}
