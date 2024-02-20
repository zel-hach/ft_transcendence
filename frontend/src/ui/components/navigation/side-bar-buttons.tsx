
import { profileIconLinks } from "./app-links"
import {v4 as uuidv4} from "uuid"
import clsx from "clsx";
import router, { useRouter } from "next/router";
import Link from "next/link";
import { IconProps } from "@/types/iconProps";
import { usePathname } from "next/navigation";
import { Typography } from "@/ui/design-system/typography/typography";
import { Button } from "@/ui/design-system/Button/button";
import { FaSignOutAlt } from "react-icons/fa";
import Cookies from "js-cookie";
import { useContext } from "react";
import { DataContext } from "@/pages/context";

interface Prop {
    className?: string;
}

interface Props {
  href: string;
  variant?: 'ico';
  size?: 'small' | 'medium' | 'large';
  iconTheme?: 'primary' | 'secondary' | 'black';
  ico?: IconProps;
  children?: React.ReactNode;
}

export const ActiveIcons = ({href, children}:Props) => {
  const router = usePathname();

  const isActive: boolean = router?.includes(href);

  return (
    <Link href={href} className={clsx('bg-gray hover:text-secondary hover:bg-gray-500 px-10 py-3 rounded', isActive && 'text-black font-bold bg-secondary rounded')}>
        {children}
    </Link>
  );
};



export const SideBarButtons = ({className}: Prop) => {  
  const {socket} = useContext(DataContext)  
  const handleLogout = () => {
    (async () => {
      const resp = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
          
        }
      );
        socket?.disconnect()
        router.push('/');
    })();
  };
  const router = useRouter();
  const {user} = useContext(DataContext);
  return (
    <div className={clsx(className)}>
        {profileIconLinks.map((icon, index) => (
          <ActiveIcons key={index} href={icon.generateLink && user ? icon.generateLink(user.id) : icon.baseUrl} ico={icon.icon}> 
            <div className={`flex items-center`}>
              <icon.icon size={35}/>
            </div>
          </ActiveIcons>
        ))}
      <Button variant="ico" icon={{Icon: FaSignOutAlt}} iconTheme="secondary" action={handleLogout} linkType="external" className="self-center"></Button>
    </div>
  );
};