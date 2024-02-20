import { Player } from "@lottiefiles/react-lottie-player";
import type { NextPage } from "next";
import styled from "styled-components";
import loading from "./loading.json";

const Span = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
`;
interface LoadingType {
  message: string;
}
const FinGame: NextPage<LoadingType> = ({ message }: LoadingType) => {
  return (
    <Span>
      <Player
        autoplay
        style={{ width: "30%" }}
        speed={1}
        loop
        src={loading}
      ></Player>
      <span>{message}</span>
    </Span>
  );
};

export default FinGame;
