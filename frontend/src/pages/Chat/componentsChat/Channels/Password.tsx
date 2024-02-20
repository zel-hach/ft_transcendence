import { DataContext } from '@/pages/context';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react'


export default function Password(props: any) {
    const [password, setPassword] = useState("");
    const [exist, setExist] = useState(false);
    const {token} = useContext(DataContext)
    const navigate = useRouter();
    const joinTochannel = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/channel/protected`, {
            method: "POST",
            credentials: "include",
            headers: {
          
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
        
              },
            body: JSON.stringify({
                userid: props.login,
                channelid: props.channelid,
                password: password
            })
        })
        if (response.ok) {
            const data = await response.json();
            if (data != 0) {
                props.Onchange(true, true, props.channelName, props.channelid, props.messages);
                props.setIsclick(false);
            }
            else
                setExist(true)
        }
        else{
            navigate.push('/');
        }
        setPassword("");
    }catch(e){
        console.log(e);
    }
    }
    const cancel = () => {
        props.setIsclick(false);
    }
    const setPass = (e: React.ChangeEvent<HTMLInputElement>) =>{
        setPassword(e.target.value)
        setExist(false)
    }
    return (
        <>
            <form className='formPass' onSubmit={joinTochannel}>
                <label className='labelPass'>this channel with password </label>
                <input type="password" className='inputPass' placeholder='password' onChange={setPass}></input>
                {exist &&
                    <p className="exist">password incorrect or you are baned</p>
                }
                <div className='validePass'>
                    <input type='button' value='cancel' className='Cancelbutton' onClick={cancel}></input>
                    <input type='button' value='valide' className='Validebutton'></input>
                </div>
            </form>
        </>
    )
}
