import { Logo } from "@/ui/design-system/Logo/logo"
import { SideBarButtons } from "../navigation/side-bar-buttons"

export const SideBar = () => {
    return (
        <>
            <div className="flex flex-col max-w-8 min-h-screen bg-gray relative items-center">
                <Logo size="medium"/>
                <SideBarButtons className="flex flex-col justify-self-center justify-between min-h-[70%] py-20"/>  
            </div>
        </>
    )
}