import React, { useContext, useEffect, useState } from "react";
import { Container } from "@/ui/components/container/container";
import { Layout } from "@/ui/components/layout/layout";
import { ProfileLinkNav } from "@/ui/components/Profile/profile-link-nav";
import { Typography } from "@/ui/design-system/typography/typography";
import axios from "axios";
import { DataContext } from "../../context";
import { useRouter } from "next/router";
import { UserInfo } from "@/ui/components/user-infos/user-infos";
import { Users } from "../../user";
import Link from "next/link";


const FriendList: React.FC = () => {
  const {token} = useContext(DataContext);
  const router = useRouter();
  const {id} = router.query;
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      if (token){
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/user/friends/${id}`, {
            withCredentials: true,
            headers: {

              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
    
            }
          });
          setFriends(response.data);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      }
      else{
        router.push('/');
      }
    };

    fetchFriends();
  }, []);

  const filteredFriends = friends.filter((friend:any) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Layout>
        <Container className="p-12 flex flex-col gap-[80px]">
          <UserInfo id = {id}/>
          <ProfileLinkNav id={id}/>
          <div className="bg-gray flex flex-col justify-center pt-5 pl-5 space-y-5 rounded w-full">
            <div className="bg-gray rounded px-12 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ">        
              {filteredFriends.length === 0 ? (
                <Typography variant="body-lg" color="primary" className="place-self-center"> You have no Friends yet! </Typography>
              ) : (
                filteredFriends.map((friend:any, index) => (
                  <Link key={index} href={`http://${process.env.NEXT_PUBLIC_HOST}:3000/profile/${friend.id}`}>
                    <Users key={index} {...friend}/>
                  </Link>
                ))
              )}
            </div>
          </div>
        </Container>
      </Layout>
    </div>
  );
};
export default FriendList;