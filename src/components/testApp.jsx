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
  Box // Added Box for visual target
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { CuboidCollider, Physics } from "@react-three/rapier";
import * as THREE from "three";
import { BBOW } from "./components/bbow";
import { PerfumeBottle } from "./components/ocean";
import { Puffycloud } from "./components/PuffyCloud";
import { Pointer } from "./components/pointer";
import { Flowers } from "./components/flowers";
import { useState, useRef, useEffect, useMemo } from "react";
import { AnimatedGroup } from "./components/animatedGroup";
import { Peach } from "./components/peach";
import { Wood } from "./components/wood"; // Assuming this component exists
import * as Tone from "tone";
import PointingArrow from "./components/pointingArrow";

// --- Helper: Explanatory Text Component ---
function ExplanatoryText({
  children,
  position,
  fontSize = 0.3,
  color = "white",
  maxWidth = 3,
  lineHeight = 1.2,
  ...props
}) {
  const textRef = useRef();
  return (
    <Billboard position={position} {...props}>
      <Text
        ref={textRef}
        font={"/fonts/NotoSerif-Black.ttf"} // Ensure this font path is correct
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        maxWidth={maxWidth}
        lineHeight={lineHeight}
        depthTest={false} // Render on top
      >
        {children}
      </Text>
    </Billboard>
  );
}

// --- Helper: Info Button ---
function InfoButton({ onClick, position = [0, 0, 0], active = false }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01; // Gentle rotation
    }
  });

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => { document.body.style.cursor = 'auto'; };
  }, [hovered]);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation(); // Prevent OrbitControls from intercepting click
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={active ? "lightgreen" : (hovered ? "hotpink" : "dodgerblue")}
          emissive={active ? "green" : (hovered ? "pink" : "blue")}
          emissiveIntensity={hovered || active ? 0.5 : 0.1}
        />
      </mesh>
      <Text
        position={[0, 0, 0.35]} // Slightly in front of the sphere
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        depthTest={false}
      >
        ?
      </Text>
    </group>
  );
}


function App() {
  const [index, setIndex] = useState(0);
  const [audioError, setAudioError] = useState(null);
  const [showExplanations, setShowExplanations] = useState(true);

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
    "Welcome! Click the perfume bottle's nozzle to explore different scents.",
    "A delicate bouquet of fresh spring flowers, evoking a sense of renewal and light.",
    "The sweet and succulent aroma of ripe peaches, bursting with juicy sunshine.",
    "The rich and grounding aroma of ancient woods, wrapping you in a warm, earthy embrace.",
    "A captivating bouquet of freshly bloomed garden roses, its velvety petals unfurling a timeless fragrance."
  ], []);

  const handleExternalNozzle = () => {
    setIndex((prevIndex) => (prevIndex + 1) % scents.length);
  };

  const toggleExplanations = () => {
    setShowExplanations(prev => !prev);
  };

  useEffect(() => {
    const initAudioContext = async () => {
      try {
        await Tone.start();
        console.log("Tone.js AudioContext started successfully.");
        setAudioError(null);
      } catch (error) {
        console.error("Error starting Tone.js AudioContext:", error);
        setAudioError(
          `Audio Error: ${error.message}. User interaction might be needed.`
        );
      }
    };
    initAudioContext();
  }, []);

  const explanations = useMemo(() => [
    {
      id: "perfume_bottle_info",
      text: "Click the nozzle on the perfume bottle to change the scent!",
      position: [3, 4, 3],
      targetPosition: [3, 0, 3],
      condition: () => true
    },
    {
      id: "scent_area_info",
      text: "The objects here represent the current scent.",
      position: [0, 3, 0],
      targetPosition: [3, 0, 3],
      condition: () => index > 0
    },
    {
      id: "description_info",
      text: "This text describes the current scent.",
      position: [-6, 2, 0],
      targetPosition: [-6, 1, 0],
      condition: () => true
    },
    {
      id: "orbit_info",
      text: "Drag to rotate the view. The scene also auto-rotates slowly.",
      position: [0, -1, 5],
      targetPosition: [0, 0, 0],
      condition: () => true
    }
  ], [index]);

  return (
    <Canvas
      shadows
      // --- FIX: Re-added the rotation prop here ---
      camera={{
        position: [15, 9, 15],
        fov: 35,
        rotation: [Math.PI * 0.2, Math.PI * 0.8, 0] // Example initial rotation
        // You can change these values to adjust the initial view
        // [x-axis rotation, y-axis rotation, z-axis rotation] in radians
      }}
    >

      {/* Visual aid: A small box at the OrbitControls target */}
      {/* This helps you see where the camera is looking initially */}
      <Box args={[0.5, 0.5, 0.5]} position={[3, 0, 3]}>
        <meshBasicMaterial color="red" wireframe />
      </Box>

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
        renderOrder={998}
      >
        {scentDescriptions[index % scentDescriptions.length]}
        <meshBasicMaterial
          color={"#E0E0E0"}
          depthTest={false}
          depthWrite={false}
        />
      </Text>

      <BBOW />
      <group position={[3, 0, 3]} rotation={[0, Math.PI * 1.2, 0]}>
        <Center top>
          <PerfumeBottle onNozzleClick={handleExternalNozzle} />
        </Center>

        {scents.map((scent, i) => (
          <AnimatedGroup key={i} active={i === index} fromY={-10} toY={2}>
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

      {showExplanations && explanations.map(exp =>
        exp.condition() && (
          <group key={exp.id + "-annotation"}>
            <ExplanatoryText position={exp.position}>
              {exp.text}
            </ExplanatoryText>

            {exp.targetPosition && (
              <PointingArrow
                start={exp.position}
                end={exp.targetPosition}
                color="cyan"
                lineWidth={10.5}
                headLength={0.3}
                headWidth={0.2}
              />
            )}
          </group>
        )
      )}

      <OrbitControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.01}
        autoRotate
        autoRotateSpeed={0.05}
        makeDefault
        enableZoom={false}
        enablePan={false}
        // --- FIX: Adjusted target to match the perfume bottle group ---
        target={[3, 0, 3]}
      />
      <Clouds limit={400} material={THREE.MeshLambertMaterial}>
        <Physics gravity={[0, 0, 0]}>
          <Pointer />
          <Puffycloud key="cloud1" seed={10} position={[20, 0, 0]} />
          <Puffycloud key="cloud2" seed={20} position={[0, 20, 0]} />
          <Puffycloud key="cloud3" seed={30} position={[20, 0, 50]} />
          <Puffycloud key="cloud4" seed={40} position={[0, 0, 20]} />
          <Puffycloud key="cloud5" seed={50} position={[20, 30, 0]} />
          <Puffycloud key="cloud6" seed={60} position={[0, 20, 30]} />
          <Puffycloud key="cloud7" seed={70} position={[20, 0, 20]} />
          <Puffycloud key="cloud8" seed={80} position={[20, 0, 20]} />
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
