import { Avatar } from "@/ui/design-system/Avatar/avatar";
import { Typography } from "@/ui/design-system/typography/typography";
import { useContext, useState } from "react";
import { userType } from "../login-button/login-button";
import { DataContext } from "@/pages/context";
import { Button } from "@/ui/design-system/Button/button";


export const Navigation = () => {
  const { user, gameData, socket, roomData } = useContext(DataContext);

  const [show, setShow] = useState(true);

  const handleClick = () => {
    socket.emit("startGame", {
      roomName: roomData.roomName,
    });
    setShow(false);
  };
  return (
    <div className="bg-gray shadow shadow-primary/50  pt-5 pb-5 pr-10">
      <div className="flex justify-end gap-4 items-center mx-auto w-full">
        {roomData?.player1 == socket?.id && roomData?.status == "pending" && (
          <div
            style={{
              color: "white",
              position: "absolute",
              fontWeight: "bolder",
              backgroundColor: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              left: "2%",
              zIndex: 1,
            }}
          >
            {show && (
              <Button action={handleClick} type="submit">
                PLAY
              </Button>
            )}
          </div>
        )}
        {gameData && roomData?.status && (
          <div
            style={{
              color: "white",
              position: "absolute",
              fontWeight: "bolder",
              backgroundColor: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              left: "50%",
              zIndex: 1,
            }}
          >
            <div className="bg-gray shadow shadow-primary/50  px-2 py-1">
              {gameData.score.player1.toString()}
            </div>
            <div className="mx-2">{"-"}</div>
            <div className="bg-gray shadow shadow-primary/50  px-2 py-1">
              {gameData.score.player2.toString()}
            </div>
          </div>
        )}
        {user && (
          <>
            <Typography variant="body-lg" color="secondary">
              {user.username}
            </Typography>
            <Avatar size="large" src={user.avatar} alt={user.username} />
          </>
        )}
      </div>
    </div>
  );
};
