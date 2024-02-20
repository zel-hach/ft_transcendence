import { usePersonControls } from "@/hooks/context/movement";
import { GameDataType, RoomDataType } from "@/hooks/context/types";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import Ball from "./modules/Ball";
import Padle from "./modules/Padle";
import Stage from "./modules/Stage";
interface gameType {
  socket: Socket;
  gameData: GameDataType;
  roomData: RoomDataType;
  size: {
    width: number;
    height: number;
  };
}
const PADDLE_SIZE = 40 / 5;
const Game = ({ socket, gameData, roomData, size }: gameType) => {
  const { camera, gl, scene }: any = useThree();
  const player = useRef<any>();
  const player2 = useRef<any>();
  const ball = useRef<any>();

  let { left, right } = usePersonControls();
  useEffect(() => {
    if (roomData.player2 == socket.id) scene.rotateZ(Math.PI);
  }, []);
  useEffect(() => {
    if (
      (left || right) &&
      (roomData.player1 == socket.id || roomData.player2 == socket.id)
    ) {
      if (roomData.player2 == socket.id)
        socket.emit("paddleMove", {
          roomName: roomData.roomName,
          socketId: socket.id,
          right: left,
          left: right,
        });
      else
        socket.emit("paddleMove", {
          roomName: roomData.roomName,
          socketId: socket.id,
          left,
          right,
        });
    }
  }, [left, right]);

  useEffect(() => {
    if (size.width < 1000) camera.fov = 110;
    if (size.width > 1000) camera.fov = 100;
    if (size.width < 700) camera.fov = 150;
    camera.updateProjectionMatrix();
  }, [size]);

  useFrame(({ gl, scene, camera }) => {
    ball.current.position.copy(gameData.ball);
    player.current.position.copy(gameData.player1);
    player2.current.position.copy(gameData.player2);
    gl.render(scene, camera);
  }, 1);

  return (
    <>
      <Ball ref={ball} />
      <Stage />
      <Padle
        position={[0, -60 / 2 + 3, 0]}
        args={[1.5, 2, PADDLE_SIZE]}
        rotateX={Math.PI / 2}
        rotateY={Math.PI / 2}
        color="#FF0000"
        name="player1"
        ref={player}
      />

      <Padle
        position={[0, 60 / 2 - 3, 0]}
        args={[1.5, 2, PADDLE_SIZE]}
        rotateX={Math.PI / 2}
        rotateY={Math.PI / 2}
        color="#EEEEEE"
        name="player2"
        ref={player2}
      />
    </>
  );
};

export default Game;
