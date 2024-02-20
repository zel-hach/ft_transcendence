import { userType } from "../login-button/login-button";
import { Navigation } from "../navigation/navigation";
import { SideBar } from "../sidebar/sidebar";

interface Props {
  children: React.ReactNode;
  user?: userType;
  showSideBar?: boolean;
  showNavigation?: boolean;
}

export const Layout = ({
  children,
  showSideBar = true,
  showNavigation = true,
}: Props) => {
  return (
    <>
      <div className="flex">
        {showSideBar && <SideBar />}
        <div className="flex flex-col bg-black w-screen">
          {showNavigation && <Navigation />}
          {children}
        </div>
      </div>
    </>
  );
};
