import { AppLinks } from "@/types/app-links";
import { CgProfile } from "react-icons/cg";
import { IoChatbubblesSharp } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { GiPingPongBat } from "react-icons/gi";
import { FaUsers } from "react-icons/fa6";

export const profileAppLinks: AppLinks[] = [
    {
        label: "Statistics",
        baseUrl: "/profile/[id]",
        generateLink: (id: string) => `/profile/${id}`,
        type: "internal",
    },
    {
        label: "Friends List",
        baseUrl: "/profile/FriendList/[id]",
        generateLink: (id: string) => `/profile/FriendList/${id}`,
        type: "internal",
    },
    {
        label: "Match History",
        baseUrl: `/profile/match-history/[id]`,
        generateLink: (id: string) => `/profile/match-history/${id}`,
        type: "internal",
    },
    {
        label: "Achievements",
        baseUrl: "/profile/achievements/[id]",
        generateLink: (id: string) => `/profile/achievements/${id}`,
        type: "internal",
    },
];

export const profileIconLinks: AppLinks[] = [
    {
        label: "profile",
        baseUrl: "/profile/[id]",
        generateLink: (id: string) => `/profile/${id}`,
        type: "internal",
        icon: CgProfile,
    },
    {
        label: "users",
        baseUrl: "/users",
        type: "internal",
        icon: FaUsers,
    },
    {
        label: "chat",
        baseUrl: "/Chat/Chat",
        type: "internal",
        icon: IoChatbubblesSharp,
    },
    {
        label: "game",
        baseUrl: "/game",
        type: "internal",
        icon: GiPingPongBat,
    },
    {
        label: "settings",
        baseUrl: "/settings",
        type: "internal",
        icon: IoSettings,
    },
];