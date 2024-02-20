import { ProfileLinkNav } from "@/ui/components/Profile/profile-link-nav";
import { StatsView } from "@/ui/components/Stats/stats.view";
import { Container } from "@/ui/components/container/container";
import { Layout } from "@/ui/components/layout/layout";
import { useContext, useEffect } from "react";
import { DataContext } from "../context";
import { useRouter } from "next/router";
import { Avatar } from "@/ui/design-system/Avatar/avatar";
import { Typography } from "@/ui/design-system/typography/typography";
import { UserInfo } from "@/ui/components/user-infos/user-infos";


export default function Statistics(){

    const backgroundImageUrl =
    '/assets/images/cover.jpg';
  const containerStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    minHeight: '250px',
  };
    const {user, token} = useContext(DataContext);
    const route = useRouter();
    const router = useRouter();
    const {id} = router.query;
    useEffect(()=>{
        if (!token)
            route.push('/');
    },[]);
    return (
        <Layout>
            <Container className="p-12 flex flex-col gap-[80px]">
                <UserInfo id={id}/>
                    {/* {user && 
                        <div style={containerStyle} className="flex items-center gap-5 px-12">
                            <Avatar src={user.avatar} alt={user.username} size="small"/>
                            <Typography color="secondary" variant="body-lg">{user.username}</Typography>
                        </div>
                    } */}
                <ProfileLinkNav id ={id}/>
                <StatsView/>
            </Container>
        </Layout>
    )
}