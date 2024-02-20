import { DataContext } from "@/pages/context";
import { History } from "@/pages/history"
import { ProfileLinkNav } from "@/ui/components/Profile/profile-link-nav";
import { Container } from "@/ui/components/container/container";
import { Layout } from "@/ui/components/layout/layout";
import { UserInfo } from "@/ui/components/user-infos/user-infos";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const HistoryList = () => {
  const {token} = useContext(DataContext); 
  const router = useRouter();
  const {id} = router.query;
  const [userHistory, setUserHistory] = useState([]);
  useEffect(() => {
    const fetchHistory= async () => {
      if (token){
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/history/${id}`, {
            withCredentials: true,
            headers: {

              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
    
            }
          });
          setUserHistory(response.data);
        } catch (error) {
          console.error("Error fetching friends:", error);
        }
      }
      else{
        router.push('/');
      }
    };

    fetchHistory();
  }, [id]);

  return(
    <div className="bg-gray-100 min-h-screen">
      <Layout>
        <Container className="p-12 flex flex-col gap-[80px]">
          <UserInfo id={id}/>
          <ProfileLinkNav id={id}/>
          <div className="bg-gray rounded px-12 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10">
            {userHistory.map((history, index) => (
              <History key={index} {...history}/>
            ))}
          </div>
        </Container>
      </Layout>
    </div>
  )
}
  
export default HistoryList;