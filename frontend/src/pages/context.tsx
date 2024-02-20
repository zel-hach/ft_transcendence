import { initialRoom, intialValue } from "@/hooks/context/helpers";
import {
  GameDataType,
  RoomDataType,
  userDataInterface,
} from "@/hooks/context/types";
import Cookies from "js-cookie";
import Router from "next/router";
import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

interface AppContextInterface {
  gameData: GameDataType;
  userData: userDataInterface | null;
  roomData: RoomDataType;
  watchers: string[];
  games: GameInvite[];
  setGames: React.Dispatch<React.SetStateAction<GameInvite[]>>;
}
interface GameInvite {
  roomName: string;
  userName: string;
}

export const DataContext = createContext<any>({});

export default function Context({ children }: any) {
  const [user, setUser] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);
  const [roomData, setRoomData] = useState<RoomDataType>(initialRoom);
  const [games, setGames] = useState<GameInvite[]>([]);
  const [gameData, setGameData] = useState<GameDataType>(intialValue);
  const token: string | undefined = Cookies.get("Authentication");


  async function fetchUser() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/user/current`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data) setUser(data);
      } else {
        setUser(null);
        throw new Error("user not exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUser();
  }, [token]);

  useEffect(() => {
    setSocket(io(`${process.env.NEXT_PUBLIC_URL}/socket`));

    return () => {
    };
  }, []);
  useEffect(() => {
    const test = async () => {
      await socket?.emit("saveClient", {
        login: user?.id,
      });
    };
    test();
    return () => {
      socket?.off("saveClient");
    };
  }, [user, socket]);

  useEffect(() => {
    socket?.on("requestToPlay", (data) => {
      const { roomName, userName } = data;
      setGames([...games, { roomName, userName }]);
    });

    socket?.on("error", () => {
      Router.push("/game/");
    });

    socket?.on("joinRoom", (data: RoomDataType) => {
      setGameData(intialValue);
      setRoomData(data);
      Router.push("/game/" + data.roomName);
    });

    socket?.on("leftGame", (data) => {
      setRoomData({
        ...roomData,
        status: data.status,
        winner: data.player1 !== "" ? roomData.player1 : roomData.player2,
      });
    });
    return () => {
      socket?.off("watcher");
      socket?.off("error");
      socket?.off("joinRoom");
      socket?.off("leftGame");
    
    };
  }, [socket]);

  useEffect(()=>{
    socket?.on("gameOver", (data) => {
      const { status, flag, player1, player2 } = data;
      setRoomData({
        ...roomData,
        flag: flag,
        status: status,
        winner: player1 === 10 ? roomData.player1 : roomData.player2,
      });
      setGameData({
        ...intialValue,
        score: {
          player1: player1,
          player2: player2,
        },
      });
    });
    return () =>{
      socket?.off("gameOver");
    }
  },[socket,roomData])
  useEffect(() => {
    socket?.on("gameData", (data: GameDataType) => {
      setGameData(data);
    });
    return () => {
      socket?.off("gameData");
    };
  }, [socket]);

  return (
    <DataContext.Provider
      value={{
        user,
        setUser,
        token,
        socket,
        roomData,
        setRoomData,
        gameData,
        setGameData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
