import { Container } from "@/ui/components/container/container";
import { ProfileLinkNav } from "@/ui/components/Profile/profile-link-nav";
import { Layout } from "@/ui/components/layout/layout";
import { StatsView } from "@/ui/components/Stats/stats.view";
import { useRouter } from "next/router";




export default function Statistics(){
  const router = useRouter();
  const {id} = router.query;
    const backgroundImageUrl =
    'https://img.freepik.com/free-photo/minimal-sport-still-life-arrangement_23-2149006291.jpg?w=2000&t=st=1706646162~exp=1706646762~hmac=efbb3a2f15281903f39466970c869c248ca408db986b69d4f3eb20d9cf5c17bc';

  const containerStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    width: '100%',
    minHeight: '300px',
  };

    return(
    <Layout>
        <Container className="p-20 flex flex-col gap-[150px]">
            <div style={containerStyle}></div>
            <ProfileLinkNav id={id}/>
            <StatsView/>
        </Container>
    </Layout>
    )
}