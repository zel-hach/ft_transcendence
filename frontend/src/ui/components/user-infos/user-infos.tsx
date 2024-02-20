import { DataContext } from "@/pages/context";
import { useContext, useEffect, useState } from "react";
import { Container } from "../container/container";
import { Typography } from "@/ui/design-system/typography/typography";
import { Avatar } from "@/ui/design-system/Avatar/avatar";
import { userType } from "../login-button/login-button";
import axios from "axios";
import toast from "react-hot-toast";

interface Props{
    [id:string] : string | string[] | undefined;
}

export const UserInfo = ({id}:Props) => {
    const [user, setUser] = useState<userType | null>();
    const {token} = useContext(DataContext);
    const backgroundImageUrl =
    '/assets/images/cover.jpg';
  const containerStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    minHeight: '250px',
  };

  useEffect(() => {
    axios.get<userType | null>(`${process.env.NEXT_PUBLIC_URL}/user/${id}`,
        {
            headers:{
                withCredentials: true,
                Authorization:`Bearer ${token}`,
            }
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [id]);
    return (
        <div>
            {user && 
                <div style={containerStyle} className="flex items-center gap-5 px-12">
                    <Avatar src={user.avatar} alt={user.username} size="small"/>
                    <Typography color="secondary" variant="h4">{user.username}</Typography>
                </div>
            }
        </div>
    );
};