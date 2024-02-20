import { ProfileLinkNav } from "@/ui/components/Profile/profile-link-nav";
import { StatsView } from "@/ui/components/Stats/stats.view";
import { Container } from "@/ui/components/container/container";
import { Layout } from "@/ui/components/layout/layout";
import { Typography } from "@/ui/design-system/typography/typography";
import { useRouter } from "next/router";


export default function DesignSystem(){
    const router = useRouter();
    const {id} = router.query;
    return(
        <Layout>
            <Container className="p-20">
                <ProfileLinkNav id={id}/>
                <Typography> Ping Pong </Typography>
                <Typography color="primary"> Ping Pong </Typography>
            </Container>
        </Layout>
    )
}