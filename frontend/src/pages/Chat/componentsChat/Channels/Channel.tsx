
import { DataContext } from "@/pages/context";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react"

export default function Channel(props: any) {
  const [channelName, setChannelName] = useState<string>("");
  const [pass, setPass] = useState<string>("");
  const [mode, setMode] = useState<number>(0);
  const [exist, setExist] = useState<boolean>(false);
  const { socket,token } = useContext(DataContext);
  const [passOb, setPassOb] = useState<boolean>(false);
  const navigate = useRouter();

  const CreateChannel = async (e:React.FormEvent) => {   
    e.stopPropagation();
    e.preventDefault();
    if (mode === 2 && pass.length == 0)
      setPassOb(true)
    else{
      try{
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/channel`, {
      method: "POST",
      credentials: "include",
      headers: {
          
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',

      },
      body: JSON.stringify({
        userid: props.loginid,
        nameCh: channelName,
        password: pass,
        mode: mode
      })
    })
    if (response.ok) {
      const data = await response.json();
      if (data == 0)
        setExist(true);
      else {
        if (mode == 0)
          props.setChannel((prv: any) => [...prv, data]);
        else {
            await socket?.emit("createChannel", (channelName));
          }
          props.setIsclick1(false);
        }
      }
      else{
        navigate.push('/');
      }
    }catch(e){
      console.log(e);
    }
  }
  }

  const cancel = (e: any) => {
    e.stopPropagation();
    props.setIsclick1(false);
  }
  const setNameCh = (e: any) => {
    setChannelName(e.target.value);
    setExist(false);
  }
  const changeMode = (e: any) => {
    setMode(e.target.selectedIndex)
  }
  const setPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPass(e.target.value);
      setPassOb(false);
  } 
  return (
    <div className="popUp">
      <form className="form" >
        <input type='text' placeholder='channel Name' className="inputPop" onChange={setNameCh}></input>
        {exist &&
          <p className="exist">channel name is exist or empty</p>
        }
        <input type='password' placeholder='password(optionnel)' className="inputPop" onChange={setPassword}></input>
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
          <input type='button' value='create' onClick={CreateChannel}></input>
        </div>
      </form>
    </div>
  )
}