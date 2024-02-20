import React, { useContext, useEffect, useRef} from 'react'
import Status from './status';
import { useRouter } from 'next/router';
import { DataContext } from '@/pages/context';
import Image from 'next/image';

export default function Conversation(props: any) {

    const conversation = JSON.stringify(props.conversation?.conversation);
    const navigate = useRouter();
    const {token} = useContext(DataContext);

    const afficherMessage = async () => {
        try{
       return( await fetch(`${process.env.NEXT_PUBLIC_URL}/conversation/getMessage/${props.conversation.users.id}/${props.login}`,{
        credentials:"include",
        headers: {
          
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
    
          }
       })
            .then(reponse => reponse.json())
            .then((data) => {
                return(data);
            })
            )
        }catch(e){
            navigate.push('/');
            console.log(e);
        }
    }
    const goToDiscussion = async (e: any) => {
        e.stopPropagation();
        sessionStorage.setItem("conversation", conversation);
        const result = await afficherMessage();
        await props.Onchange(false, 'true', props.conversation?.users.username,props.conversation?.conversation.id, result,props.conversation?.users.id,props.conversation?.users.avatar,props.conversation?.users.status);
    }
    const scrollRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [props.conversation])
    return (
        <div className='friend'>
            <div className='newMessage' ref={scrollRef}>
                <div className='en_ligne'>
                    <Image src={props.conversation?.users.avatar} className='imageProfile' alt="avatar" width={40} height={40}></Image>
                    <Status status={props.conversation?.users.status}></Status>
                </div>
                <span onClick={goToDiscussion} className='SpanUser'>{props.conversation?.users.username}</span>
            </div>
        </div>
    )
}
