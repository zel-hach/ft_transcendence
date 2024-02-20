import { Canvas } from "@react-three/fiber";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useResize } from "@/hooks/context/movement";
import { DataContext } from "../context";
import { Layout } from "@/ui/components/layout/layout";
import Overlay from "@/ui/components/game/Overlay";
import HowToPlay from "@/ui/components/game/HowToPlay";
import Game from "@/ui/components/game/game";

const Home = () => {
  const router = useRouter();
  const { room } = router.query;
  const { gameData, roomData, socket } = useContext(DataContext);
  const [sym, setSym] = useState(false);
  const [hidden, setHidden] = useState(false);
  let size = useResize();
  const route = useRouter();

  useEffect(() => {
    if (roomData.roomName != "") setSym(true);
    else
      route.push('/game');
  }, [roomData.roomName]);

  return (
    <Layout showSideBar={false}>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: -1,
          backgroundColor: "black",
        }}
      >
        {roomData?.status == "gameOver"  && (
          <Overlay
            data={roomData.winner === socket.id ? true : false}
            isAdmin={roomData.player1 == socket.id}
            hidden={
              roomData.player1 == socket.id || roomData.player2 == socket.id
                ? true
                : false
            }
            onClick={() =>
              socket.emit("startGame", {
                roomName: roomData.roomName,
              })
            }
          />
        )}
        <HowToPlay hidden={hidden} setHidden={setHidden} />
        {sym && (
          <div
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Canvas
              shadows={true}
              camera={{
                fov: 75,
                position: [-0.018223506966510716, -54, 20],
                near: 0.1,
                far: 1000,
              }}
            >
              <pointLight
                position={[0, 0, 30]}
                color={"white"}
                intensity={0.9}
                distance={100}
              />
              {/* @ts-ignore */}
              <ambientLight intensity={0.8} color={"white"} />
              <Game
                socket={socket}
                gameData={gameData}
                roomData={roomData}
                size={size}
              />
            </Canvas>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
