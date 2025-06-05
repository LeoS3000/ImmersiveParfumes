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
  Billboard,
  Float,
  PositionalAudio,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics } from "@react-three/rapier";
import * as THREE from "three";
import { BBOW } from "./components/bbow";
import { PerfumeBottle } from "./components/ocean";
import { Puffycloud } from "./components/PuffyCloud";
import { Pointer } from "./components/pointer";
import { Flowers } from "./components/flowers";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { AnimatedGroup } from "./components/animatedGroup";
import { Peach } from "./components/peach";
import { Wood } from "./components/wood";
import * as Tone from "tone";
import { CameraLogger } from "./components/camLogger";
import { StaticOverlay } from "./components/staticOverlay";


function App() {
  const [index, setIndex] = useState(0);
  const [audioError, setAudioError] = useState(null);
  // --- NEW: State to control the static overlay ---
  const [showOverlay, setShowOverlay] = useState(true);

  const handleCloudRise = () => {
    console.log("A cloud has risen!");
  };

  const ambientSoundUrl = "/sounds/ocean.mp3";

  const scents = useMemo(() => [
    <></>,
    <>
      <Flowers key="flowers" position={[9, 0, 0]} />
      <Flowers key="flowers2" position={[6, 0, 4]} />
      <Flowers key="flowers3" position={[9, 0, 0]} />
      <Flowers key="flowers4" position={[0, 0, 0]} />
      <Flowers key="flowers5" position={[-4, 1, 4]} />
      <Flowers key="flowers6" position={[6, 1, 2]} />
      <Flowers key="flowers7" position={[6, 1, 0]} />
      <Flowers key="flowers8" position={[5, 1, -2]} />
    </>,
    <>
      <Peach key="Peach" />
      <Peach key="Peach2" position={[-2, 1, 4]} />
      <Peach key="Peach3" position={[-4, 2, 4]} />
      <Peach key="Peach4" position={[-6, 2, 2]} />
      <Peach key="Peach5" position={[-6, 1, 0]} />
      <Peach key="Peach6" position={[-5, 1, -2]} />
    </>,
    <>
      <Wood key="wood1" position={[2, 1, 5]} />
      <Wood key="wood2" position={[-1, 1, 6]} />
      <Wood key="wood3" position={[0, 1, 3]} />
    </>
  ], []);

  const scentDescriptions = useMemo(() => [
    "",
    "A delicate bouquet of fresh spring flowers, evoking a sense of renewal and light.",
    "The sweet and succulent aroma of ripe peaches, bursting with juicy sunshine.",
    "The rich and grounding aroma of ancient woods, wrapping you in a warm, earthy embrace.",
    "A captivating bouquet of freshly bloomed garden roses, its velvety petals unfurling a timeless fragrance."
  ], []);

  const handleExternalNozzle = () => {
    setIndex((prevIndex) => (prevIndex + 1) % scents.length);
  };

  // --- Function to hide the overlay and start the audio context ---
  const handleStartExperience = async () => {
    setShowOverlay(false); // Hide the overlay
    try {
      await Tone.start();
      console.log("Tone.js AudioContext started successfully.");
      setAudioError(null);
    } catch (error) {
      console.error("Error starting Tone.js AudioContext:", error);
      setAudioError(`Audio Error: ${error.message}.`);
    }
  };

  // This useEffect is no longer strictly needed to start Tone,
  // as we now tie it to the user's first click.
  useEffect(() => {
    // You could pre-load assets here if needed.
  }, []);

  // --- Conditional Rendering ---
  // If showOverlay is true, display the static picture.
  // Otherwise, render the 3D canvas.
  if (showOverlay) {
    return <StaticOverlay onStart={handleStartExperience} />;
  }

  // --- Main 3D Scene ---
  return (
    <Canvas
      shadows
      camera={{
        position: [7, 3.5, 28],
        fov: 35,
        rotation: [Math.PI * 0.2, Math.PI * 0.8, 0]
      }}
    >
      <CameraLogger />
      <spotLight
        position={[15, 50, 4]}
        angle={0}
        decay={0.5}
        distance={45}
        penumbra={1}
        intensity={20000}
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
      <Text
        font={"/fonts/NotoSerif-Black.ttf"}
        fontSize={1}
        position={[-6, 1, 0]}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        maxWidth={10}
        lineHeight={1.3}
      >
        {scentDescriptions[index % scentDescriptions.length]}
        <meshBasicMaterial
          color={"#E0E0E0"}
          depthTest={false}
          depthWrite={false}
          renderOrder={999}
        />
      </Text>

      <BBOW />
      <group position={[3, 0, 3]} rotation={[0, Math.PI * 1.2, 0]}>
        <Center top>
          <PerfumeBottle onNozzleClick={handleExternalNozzle} />
        </Center>

        {scents.map((scent, i) => (
          <AnimatedGroup key={i} active={i === index} fromY={-10} toY={2} renderOrder={1}>
            <Float speed={1} rotationIntensity={2} floatIntensity={1}>
              {scent}
            </Float>
          </AnimatedGroup>
        ))}

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
        enableDamping
      />
      <Clouds limit={400} material={THREE.MeshLambertMaterial}>
        <Physics gravity={[0, 0, 0]}>
          <Pointer />
          <Puffycloud key="cloud1" seed={10} position={[2, 0, 0]} />
          <Puffycloud key="cloud2" seed={20} position={[0, 2, 0]} />
          <Puffycloud key="cloud3" seed={30} position={[2, 0, 5]} />
          <Puffycloud key="cloud4" seed={40} position={[0, 0, 2]} />
          <Puffycloud key="cloud5" seed={50} position={[2, 3, 0]} />
          <Puffycloud key="cloud6" seed={60} position={[0, 2, 3]} />
          <Puffycloud key="cloud7" seed={70} position={[2, 0, 2]} />
          <Puffycloud key="cloud8" seed={80} position={[2, 0, 2]} onCloudRisen={handleCloudRise} />
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
      {ambientSoundUrl &&
        !audioError && (
          <PositionalAudio
            url={ambientSoundUrl}
            autoplay={true}
            loop={true}
            distance={30}
            volume={0.3}
          />
        )}
      {audioError && (
        <Text
          color="red"
          fontSize={0.5}
          position={[0, -2, 0]}
          anchorX="center"
          anchorY="middle"
        >
          {audioError}
        </Text>
      )}
    </Canvas>
  );
}

export default App;