import React, { useContext, useEffect, useState } from 'react'
import AddFriend from './AddFriend';
import { useRouter } from 'next/router';
import { DataContext } from '@/pages/context';


export default function User(props: any) {
  const [user, setUser] = useState<any[]>([]);
  const [inputSearch, setInputSearch] = useState<string>('');
  const navigate = useRouter();
  const {token} = useContext(DataContext);
  const getAllUser = async () => {
    try{
    return (await fetch(`${process.env.NEXT_PUBLIC_URL}/user`,{
      credentials:'include',
      headers: {
          
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',

      }
   })
      .then((response) => response.json())
      .then((data) => {
        setUser(prv => [...prv, ...data]);
        return (data);
      })
    )
    }catch(e){
      navigate.push('/');
      console.log(e);
    }
  }
  useEffect(() => {
    getAllUser()
  },[])

  const findUser = user.filter((u) => {
    return (u.id != props.login);
  })
  const search = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(e.target.value);
    e.stopPropagation();
    const users = await getAllUser();
    if (e.target.value.trim() === "")
      setUser(users);
    else {
      const filterUser = user.filter((u) => { return (u.username.includes(inputSearch)) });
      if (filterUser.length != 0)
        setUser(filterUser);
      else
        setUser(users);
    }
  }

  return (
    <div className="popUpUser">
      <input type='text' placeholder='search' className='search' onChange={search}></input>
      <div className='users'>
        {
          findUser.map((user, index) => {
            return (
              <AddFriend username={user?.username} status={user?.status} avatar={user?.avatar} userid={user?.id} login={props?.login} Onchange={props.Onchange} setClickUser={props.setClickUser} clickUser={props.clickUser} key={index}></AddFriend> 
            )
          })
        }
      </div>
    </div>
  )
}
