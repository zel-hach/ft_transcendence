import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Typography } from '@/ui/design-system/typography/typography'
import { Button } from '@/ui/design-system/Button/button'
import { Si42 } from "react-icons/si";
import { Logo } from '@/ui/design-system/Logo/logo';
import { Avatar } from '@/ui/design-system/Avatar/avatar';
import { Container } from '@/ui/components/container/container';
import { Navigation } from '@/ui/components/navigation/navigation';
import { Footer } from '@/ui/components/footer/footer';
import { LandingPage } from '@/ui/modules/landing-page/landing-page';
import { Spinner } from '@/ui/design-system/spinner/spinner';
import { ProfileLinkNav } from '@/ui/components/Profile/profile-link-nav';
import { ActiveLink } from '@/ui/components/navigation/active-link';
import { StatsView } from '@/ui/components/Stats/stats.view/[id]';
import { Layout } from '@/ui/components/layout/layout';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import toast from 'react-hot-toast';
import { userType } from '@/ui/components/login-button/login-button';



export default function Home() {
  return (
    <>
       <div className="bg-black shadow shadow-primary/50">
        <Container className="flex justify-between items-center">
          <Link href="/">
            <Logo size="medium"/>
          </Link>
        </Container>
       </div>
      <LandingPage/>
      <Footer/>
    </>
  )
}
