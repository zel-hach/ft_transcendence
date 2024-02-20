

import { Typography } from "@/ui/design-system/typography/typography";
import React, { useContext } from "react";
import { IconType } from "react-icons";
import { ImSad } from "react-icons/im";
import { ImHappy } from "react-icons/im";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { Container } from "../container/container";
import { DataContext } from "@/pages/context";


interface Stats{
    label: string,
    number: number,
    icon: IconType,
    color: string;
}

export const StatsView = () => {
    const {user} = useContext(DataContext);
    const losses = user?.loss || 0;
    const wins = user?.wins || 0;
    const totalGames = (user?.wins + user?.loss) || 0;

    const statsElem: Stats[] = [
        {
          label: "Losses",
          number: losses,
          icon: ImSad,
          color: "text-red-400",
        },
        {
          label: "Wins",
          number: wins,
          icon: ImHappy,
          color: "text-green-500",
        },
        {
          label: "Total games",
          number: totalGames,
          icon: IoCheckmarkDoneCircleOutline,
          color: "text-primary",
        },
      ];

    const statsData = statsElem.map((elem) => {
        return (
            <Container className="bg-black py-[50px] flex justify-between border border-primary rounded h-full">
                <Container className="flex justify-between"> 
                    <div className="flex gap-5 ml-7">
                        <div className={`text-5xl bg-black rounded-full ${elem.color}`}>{React.createElement(elem.icon)}</div>
                        <Typography color="white"> {elem.label}</Typography>
                    </div>
                    <Typography color="white" className="mr-7">{elem.number}</Typography>
                </Container>
            </Container>
        );
    });

    return (
        <div className="flex items-center justify-center">
            <Container className="flex flex-col">
                {user &&
                    <div className=" bg-gray flex flex-col gap-5 py-12 px-12 rounded">
                        {statsData}
                    </div>
                }
            </Container>
        </div>
    );
};