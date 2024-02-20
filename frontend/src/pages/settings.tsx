import { Container } from "@/ui/components/container/container";
import { Layout } from "@/ui/components/layout/layout";
import { SettingsContainer } from "@/ui/components/settings/settings.container";
import Cookies from "js-cookie";
import {useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "./context";


export default function Settings(){
    const router = useRouter();
    const {user,token} = useContext(DataContext);
    useEffect(()=>{
        if(!user && !token)
        {
            router.push('/');
        }
    },[token]);
      return(<>
            <Layout>
                <Container className="p-20">
                    <SettingsContainer/>
                </Container>
            </Layout>
    </>
    )
    };