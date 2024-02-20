import { IconType } from "react-icons";

export interface AppLinks{
    label: string;
    baseUrl: string;
    generateLink?: Function;
    type: string;
    icon?: any;
}