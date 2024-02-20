import React from "react";
import { MeshPhysicalMaterial } from "three";
import Padlle from "./Padle";

type StageProps = {
  refBottom: any;
  refTop: any;
  refLeft: any;
  refRight: any;
};

const Stage = React.forwardRef((props, ref: any) => {
  const material = new MeshPhysicalMaterial({
    color: "#A1AC26",
    emissive: 0x000000,
    metalness: 0.5,
    roughness: 0.5,
    reflectivity: 1,
    clearcoat: 0.5,
    clearcoatRoughness: 0.5,
  });

  return (
    <>
      <mesh castShadow={true} material={material} receiveShadow>
        <planeGeometry attach="geometry" args={[40, 60]} />
      </mesh>
      <Padlle
        position={[0, 60 / 2, 0.75]}
        color="#F0DB1B"
        args={[1.5, 1.5, 40]}
        rotateX={Math.PI / 2}
        rotateY={Math.PI / 2}
        name="top"
      />
      <Padlle
        position={[0, -60 / 2, 0.75]}
        color="#F0DB1B"
        args={[1.5, 1.5, 40]}
        rotateX={Math.PI / 2}
        rotateY={Math.PI / 2}
        name="bottom"
      />
      <Padlle
        position={[-40 / 2, 0, 0.75]}
        color="#F0DB1B"
        args={[1.5, 1.5, 61.5]}
        rotateX={Math.PI / 2}
        name="left"
      />
      <Padlle
        position={[40 / 2, 0, 0.75]}
        color="#F0DB1B"
        args={[1.5, 1.5, 61.5]}
        rotateX={Math.PI / 2}
        name="right"
      />
    </>
  );
});
Stage.displayName = "Stage";

export default Stage;
