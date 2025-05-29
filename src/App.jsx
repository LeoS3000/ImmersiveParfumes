import {
  AccumulativeShadows,
  Center,
  Clouds,
  ContactShadows,
  Environment,
  OrbitControls,
  RandomizedLight,
  Sky,
  Text,
  Billboard
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics } from "@react-three/rapier";
import * as THREE from "three";
import { BBOW } from "./components/bbow";
import { Ocean } from "./components/ocean";
import { Puffycloud } from "./components/PuffyCloud";
import { Pointer } from "./components/pointer";

function App() {
  return (
    <Canvas shadows camera={{ position: [15, 9, 15], fov: 35 }}>
      {/*<ambientLight intensity={Math.PI} />*/}
      <spotLight
        position={[15, 50, 4]}
        angle={0.5}
        decay={1}
        distance={45}
        penumbra={1}
        intensity={2000}
      />
      <spotLight
        position={[-4, 10, -5]}
        color="red"
        angle={0.25}
        decay={0.75}
        distance={185}
        penumbra={-1}
        intensity={400}
      />
      <Text font={"fonts/NotoSerif-Black.ttf"} renderOrder={999}>
        DISCOVER YOUR {"\n"} NEW SCENT
        <meshBasicMaterial
          color={"white"}
          depthTest={false}
          depthWrite={false}
        />
      </Text>
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false} // Lock the rotation on the z axis (default=false)
      >
        <Text fontSize={1}>I'm a billboard</Text>
      </Billboard>
      <BBOW></BBOW>
      <group position={[0, 0, 0]}>
        <Center top>
          <Ocean />
        </Center>
        <AccumulativeShadows
          temporal
          frames={100}
          alphaTest={0.9}
          color="#005b96"
          colorBlend={1}
          opacity={0.8}
          scale={20}
        >
          <RandomizedLight
            radius={10}
            ambient={0.5}
            intensity={Math.PI}
            position={[2.5, 8, -2.5]}
            bias={0.001}
          />
        </AccumulativeShadows>
      </group>
      <OrbitControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.01}
        autoRotate
        autoRotateSpeed={0.05}
        makeDefault
        enableZoom={false}
        enablePan={false}
      />
      <Clouds limit={400} material={THREE.MeshLambertMaterial}>
        <Physics gravity={[0, 0, 0]}>
          <Pointer />
          <Puffycloud seed={10} position={[50, 0, 0]} />
          <Puffycloud seed={20} position={[0, 50, 0]} />
          <Puffycloud seed={30} position={[50, 0, 50]} />
          <Puffycloud seed={40} position={[0, 0, -50]} />
          <CuboidCollider position={[0, -15, 0]} args={[400, 10, 400]} />
        </Physics>
      </Clouds>
      <ContactShadows
        opacity={0.25}
        color="black"
        position={[0, -10, 0]}
        scale={50}
        blur={2.5}
        far={40}
      />

      <Sky
        scale={1000}
        sunPosition={[500, 1, -1000]}
        turbidity={5}
        rayleigh={2}
        mieCoefficient={0.01}
        mieDirectionalG={0.69}
      />
      <Environment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr"
        background
        backgroundBlurriness={0.5}
      />
    </Canvas>
  );
}

export default App;
