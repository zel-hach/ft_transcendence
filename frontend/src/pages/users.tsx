import React, { useContext, useEffect, useState } from "react";
import { Friend } from "@/pages/friend";
import axios from "axios";
import { useRouter } from "next/router";
import { DataContext } from "./context";
import { Layout } from "@/ui/components/layout/layout";
import { Container } from "@/ui/components/container/container";
import { Typography } from "@/ui/design-system/typography/typography";


const FriendList: React.FC = () => {
  const {user, token,socket} = useContext(DataContext);
  const route = useRouter();
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      if (token){
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/user/other/${user?.id}`, {
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
        route.push('/');
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
        <Container className="bg-gray rounded p-12 flex flex-col gap-5 mt-[5%] min-h-[70%]">
            <input
              type="text"
              placeholder="Search by username"
              className=" max-w-2xl text-white p-2 pl-5 border border-primary rounded bg-gray focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="rounded px-12 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">        
              {filteredFriends.length === 0 ? (
                <Typography variant="body-lg" color="primary" className="text-center">No friends found with the provided username! </Typography>
              ) : (
                filteredFriends.map((friend:any, index) => (
                  <Friend onButtonClick={() => {}} key={index} {...friend}/>
                ))
              )}
            </div>
        </Container>
      </Layout>
    </div>
  );
};
export default FriendList;