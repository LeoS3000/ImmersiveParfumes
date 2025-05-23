import { Environment, MeshPortalMaterial, OrbitControls, RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Jumbo } from "./jumbo"

export const Experience = () => {
  const map = useTexture("/textures/office.jpeg");

  return (
    <>
      <ambientLight intensity={0.5} />
      <Environment preset="city" />
      <OrbitControls />
      <ParfumeStage texture={"/textures/office.jpeg"} position-z={-0.3}>
        <Jumbo />
      </ParfumeStage>

      <ParfumeStage texture={"/textures/office.jpeg"} position-x={-2.5} rotation-y={Math.PI / 8}>
        <Jumbo />
      </ParfumeStage>

      <ParfumeStage texture={"/textures/office.jpeg"} position-x={2.5} rotation-y={-(Math.PI / 8)}>
        <Jumbo />
      </ParfumeStage>      
    </>
  );
};

const ParfumeStage = ({children, texture, ...props}) => {
  const map = useTexture(texture);
  return <group {...props}>
      <RoundedBox args={[2, 3, 0.1]} radius={0.05} smoothness={4} scale={1}>
      <MeshPortalMaterial side={THREE.DoubleSide}>
        <ambientLight intensity={1} />
        {children}
        <mesh>
          <sphereGeometry args={[5, 32, 32]} />
          <meshStandardMaterial map={map} side={THREE.BackSide} />
        </mesh>
      </MeshPortalMaterial>
      </RoundedBox>
  </group>;
}