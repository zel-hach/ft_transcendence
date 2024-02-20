import React, { useState } from "react";
import { FaUserCheck } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { Typography } from "@/ui/design-system/typography/typography";
import { Avatar } from "@/ui/design-system/Avatar/avatar";


interface FriendProps {
  name: string;
  username: string;
  avatar: string;
  status: string;
  id: number;
}

export const Users: React.FC<FriendProps> = ({
  name,
  username,
  avatar,
  status ,
  id,
}) => {
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
      <button
        className={`bg-primary secondary flex items-center px-4 py-2 rounded focus:outline-none hover:bg-opacity-80 transition-all`}
      >
          <FaUserCheck className="w-6 h-6 mr-2 text-white" />
        {"Friend"}
      </button>
    </div>
  );
};