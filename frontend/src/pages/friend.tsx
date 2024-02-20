import React, { useContext, useEffect, useState } from "react";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { DataContext } from "./context";
import { Avatar } from "@/ui/design-system/Avatar/avatar";
import { Typography } from "@/ui/design-system/typography/typography";


interface FriendProps {
  name: string;
  username: string;
  avatar: string;
  status: string;
  id: number;
  own:boolean;
  onButtonClick: () => void;
}

export const Friend: React.FC<FriendProps> = ({
  name,
  username,
  avatar,
  status ,
  id,
  own,
  onButtonClick,
}) => {
  const [isFriend, setIsFriend] = useState(false);
  const {user,socket,token} = useContext(DataContext)
  const [isSent,setIsSent] = useState(false);
  const [accepted,setAccepted] = useState(false);

  useEffect(()=>{
    if(user)
    {
    const FriendInvited = async() =>{
      await fetch(`${process.env.NEXT_PUBLIC_URL}/friend-request/isrequest/${id}/${user?.id}`,{
        credentials: 'include',
        headers: {

          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',

        }
      }).then((response)=>response.json())
      .then((data)=>{
        if(data == true)
        {
          setIsSent(true);
          setAccepted(!data)
        }
        else{
          setIsSent(false);
        }
      })
    }
    FriendInvited();
  }
  },[token,user,id])
  const handleFriendClick = (e:any) => {
   
  e.preventDefault();
  setIsFriend(!isFriend);
  socket?.emit("friend-request",{senderId:user.id,receiverId:id})
  };
  useEffect(()=>{
    socket?.on("friend-request",(data:any)=>{
      setIsSent(data.sender==username)
    })
    return () =>{
      socket?.off("friend-request");
    }
  },[socket])
  const Accept = (e:any) =>{
    e.stopPropagation();
    setAccepted(true)
    socket?.emit("accept-friend",{senderId:user.id,receiverId:id});
  }
  useEffect(()=>{
    socket?.on("accept-friend",(data:any)=>{
      setAccepted(data.reciver==username)
    })
    return () =>{
      socket?.off("accept-friend");
    }
  },[socket])

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-black rounded-lg shadow-md rounded border border-primary/40">
      <div className="relative">
        <Avatar size="small" src={avatar} alt={name}/>
        <div
          className={`absolute bottom-0 right-2 w-4 h-4 rounded-full ${
            status === "online" ? "bg-green-500" : status === "offline"? "bg-gray-500" : "bg-orange-500"
          } border-2 border-white`}
        >
        </div>
      </div>
      <div className="text-center">
        <div className="flex items-center">
          <FaRegUser className="w-4 h-4 mr-2 text-secondary"/>
          <Typography variant="caption1" color="secondary">
            {username}
          </Typography>
        </div>
      </div>
      <div
        onClick={handleFriendClick}
        className={`bg-primary secondary flex items-center px-4 py-2 rounded focus:outline-none hover:bg-opacity-80 transition-all`}
      >
        {
          isSent ?
          <>
          {
            accepted?
            <p>accepted</p>:
            <p onClick={Accept}>accept</p>
          }
          </>:
          <>
          {isFriend ? (
            <FaUserCheck className="w-6 h-6 mr-2 text-white" />
          ) : (
            <BsFillPersonPlusFill className="w-6 h-6 mr-2 text-white" />
          )}
          {isFriend ? "Request sent" : "Add Friend"}
          </>
}
      </div>
    </div>
  );
};