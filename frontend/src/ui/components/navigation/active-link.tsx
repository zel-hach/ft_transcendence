import { IconProps } from "@/types/iconProps";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

interface Props{
    href: string;
    variant?: "ico";
    size?: "small" | "medium" | "large";
    iconTheme?: "primary" | "secondary" | "black";
    ico?:IconProps;
    children?:React.ReactNode;
}
        
export const ActiveLink = ({href, children} : Props) => {
    const router = useRouter();
    
    const isActive: boolean = useMemo(() => {
        return(router.pathname === href)
    }, [router.pathname, href])

    return(
        <Link href={href} className={clsx("bg-gray hover:text-secondary hover:bg-gray-700 px-10 py-3 rounded", isActive && "text-black font-semibold bg-secondary rounded")}>      
                {children}
        </Link>
    )
}