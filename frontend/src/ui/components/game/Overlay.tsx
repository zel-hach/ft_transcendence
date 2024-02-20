import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

const Div = styled.div`
  width: 100%;
  height: 100%;
  background-color: #000;
  position: absolute;
  z-index: 11;
  opacity: 88%;
  display: flex;
  align-items: center;
  justify-content: center;
  > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
const Texty = styled.div<{ data: boolean }>`
  text-shadow: ${(props) =>
    props.data ? " 2px 2px #d1d718" : "2px 2px #d71818"};
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
`;
interface type {
  data: boolean;
  isAdmin: boolean;
  hidden: boolean;
  onClick?: () => void;
}
const Overlay: React.FC<type> = ({
  data,
  isAdmin,
  onClick,
  hidden = false,
}: type) => {
  const router = useRouter();
  React.useEffect(() => {
    setTimeout(() => router.reload(), 2000);
  }, []);
  return (
    <Div>
      {hidden ? (
        data ? (
          <div>
            <p>You Win !</p>
          </div>
        ) : (
          <div>
            <p>You loose !</p>
          </div>
        )
      ) : (
        <Texty data={data}>Game Over</Texty>
      )}
    </Div>
  );
};

export default Overlay;
