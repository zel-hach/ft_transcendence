import { DataContext } from "@/pages/context";
import { Button } from "@/ui/design-system/Button/button";
import { useContext, useState } from "react";

const MatchInfos = ({ setHidden }: { setHidden: (v: boolean) => void }) => {
  const { gameData, roomData, watchers, socket } = useContext(DataContext);
  const [show, setShow] = useState(true);

  const handleClick = () => {
    socket.emit("startGame", {
      roomName: roomData.roomName,
    });
    setShow(false);
  };

  return (
    <div>
      {roomData?.player1 == socket?.id && roomData?.status == "pending" && (
        <>
          {show && (
            <Button action={handleClick} type="button">
              PLAY
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default MatchInfos;
