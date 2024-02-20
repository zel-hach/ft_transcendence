import { profileAppLinks } from "../navigation/app-links";
import {v4 as uuidv4} from "uuid"
import { Typography } from "@/ui/design-system/typography/typography";
import { ActiveLink } from "../navigation/active-link";
import { AppLinks } from "@/types/app-links";
import { SideBarButtons } from "../navigation/side-bar-buttons";
import { SideBar } from "../sidebar/sidebar";
import clsx from "clsx";
import { useContext } from "react";
import { DataContext } from "@/pages/context";

interface Props {
    id:string | string[] | undefined;
}
export const ProfileLinkNav = ({id}:Props)=> {
    const profileNavigationList = profileAppLinks.map((element) => <div key={uuidv4()}>{element.label}</div>);
    return (
        <div className= "flex">
            <div className="bg-black w-full">
                <ProfileLink data={profileAppLinks} className="flex w-full justify-evenly flex-wrap" id={id}/>
            </div>
        </div>
    );
};

interface profileLinkProps {
    data: AppLinks[];
    className?: string;
    id:string | string[] | undefined,
}

const ProfileLink = ({data, className,id} : profileLinkProps) => {
    const {user} = useContext(DataContext);
    
    const linkList = data.map((link) => (
        <div key={uuidv4()}>
            <ActiveLink href={link.generateLink ? link.generateLink(id) : link.baseUrl}>{link.label}</ActiveLink>
        </div>  
    ));
    return (
        <div>
            <Typography color="white" variant="body-base" className={clsx(className)}>
                {linkList}
            </Typography>
        </div>
    );
};