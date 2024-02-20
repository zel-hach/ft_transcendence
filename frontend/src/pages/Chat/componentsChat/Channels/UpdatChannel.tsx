import { DataContext } from '@/pages/context';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react'

export default function UpdatChannel(props: any) {
    const [pass, setPass] = useState<string>("");
    const [passOb, setPassOb] = useState<boolean>(false);
    const [mode, setMode] = useState<number>(0);
    const navigate = useRouter();

    const { user, token} = useContext(DataContext);

    const UpdateChannel = async (e: React.FormEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (mode === 2 && pass.length == 0)
            setPassOb(true)
        else {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/channel/changePass`, {
                    method: "POST",
                    credentials: "include",
                    headers: {

                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',

                    },
                    body: JSON.stringify({
                        userid: user?.id,
                        channelid: props.channelid,
                        password: pass,
                        mode: mode
                    })
                })
                if (response.ok) {
                    const data = await response.json();
                    props.setClick(false);
                }
                else {
                    navigate.push('/');
                }
            } catch (e) {
                console.log(e);
            }
        }
    }
    const setPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPass(e.target.value);
        setPassOb(false);
    }
    const changeMode = (e: any) => {
        setMode(e.target.selectedIndex)
    }
    const cancel =()=>{
        props.setClick(false);
    }
    return (
        <div className="popUp">
            <form className="form" >
                <p className='channelName'>{props.name}</p>
                <input type='password' placeholder='new password' className="inputPop" onChange={setPassword}></input>
                {passOb &&
                    <p className="exist">can you set password</p>
                }
                <div className="toggele">
                    <label className="mode">mode </label>
                    <label className="switch">
                        <select name="mode" id="mode" onChange={changeMode}>
                            <option>private</option>
                            <option>public</option>
                            <option>protected</option>
                        </select>
                    </label>
                </div>
                <div className="valide">
                    <input type='button' value='cancel' onClick={cancel}></input>
                    <input type='button' value='create' onClick={UpdateChannel}></input>
                </div>
            </form>
        </div>
    )
}
