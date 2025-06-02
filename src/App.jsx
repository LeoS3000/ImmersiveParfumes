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
  PositionalAudio, // Added for sound
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { CuboidCollider, Physics } from "@react-three/rapier";
import * as THREE from "three";
import { BBOW } from "./components/bbow";
import { PerfumeBottle } from "./components/ocean";
import { Puffycloud } from "./components/PuffyCloud";
import { Pointer } from "./components/pointer";
import { Flowers } from "./components/flowers";
import { useState, useRef, useEffect } from "react";
import { AnimatedGroup } from "./components/animatedGroup";
import { Peach } from "./components/peach";
import { Ambient } from "./components/ambient"; // This is likely for lighting
import { Wood } from "./components/wood";
import * as Tone from "tone"; // Kept for Tone.start() and potential other uses

function App() {
  const [index, setIndex] = useState(0);
  // Removed audioBuffer state, as PositionalAudio will handle loading from URL
  const [audioError, setAudioError] = useState(null);

  // --- IMPORTANT ---
  // Replace this URL with the actual path to your MP3 file.
  // For example, if you place "ambient-music.mp3" in your `public/audio/` folder,
  // the URL would be "/audio/ambient-music.mp3".
  const ambientSoundUrl = "/sounds/ocean.mp3"; // <<< REPLACE THIS

  const scents = [
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

  ];
  const scentDescriptions = [
    "Discover your new scent",
    "A delicate bouquet of fresh spring flowers, evoking a sense of renewal and light.",
    "The sweet and succulent aroma of ripe peaches, bursting with juicy sunshine.",
    "The rich and grounding aroma of ancient woods, wrapping you in a warm, earthy embrace that evokes deep tranquility.",
    "A captivating bouquet of freshly bloomed garden roses, its velvety petals unfurling a timeless fragrance of romance and elegant sophistication."
    // Add more descriptions if you have more scents
  ];

  const handleExternalNozzle = () => {
    setIndex((prevIndex) => (prevIndex + 1) % scents.length);
  };

  // Effect to initialize AudioContext
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        // It's good practice to start Tone.js AudioContext on a user gesture
        // or early in the app lifecycle. PositionalAudio relies on an AudioContext.
        await Tone.start();
        console.log("Tone.js AudioContext started successfully.");
        setAudioError(null); // Clear any previous audio errors
      } catch (error) {
        console.error("Error starting Tone.js AudioContext:", error);
        setAudioError(
          `Audio Error: ${error.message}. User interaction might be needed.`
        );
      }
    };

    initAudioContext();

    // Optional: Cleanup function for Tone.js if you were using global Tone objects
    // For just Tone.start(), explicit cleanup might not be strictly necessary here.
    return () => {
      // If you had started Tone.Transport or other global synths, stop them here.
      // e.g., Tone.Transport.stop(); Tone.Transport.cancel();
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <Canvas shadows camera={{ position: [15, 9, 15], fov: 35, rotation: [Math.PI * 1, Math.PI * 1, 0] }}>
      {/* Ambient Light for the scene */}
      {/* SpotLights for dynamic lighting */}
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
        penumbra={-1} // Penumbra is usually between 0 and 1. Consider adjusting.
        intensity={400}
      />
      <Text
        font={"/fonts/NotoSerif-Black.ttf"} // Re-use font or choose another; ensure path is correct
        fontSize={1} // Smaller than the title
        position={[-6, 1, 0]} // Positioned below the title
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        maxWidth={10} // Max width before text wraps
        lineHeight={1.3} // Adjust line height for readability
        renderOrder={998} // High render order, just below title if overlapping
      >
        {scentDescriptions[index % scentDescriptions.length]} {/* Handles if arrays mismatch length */}
        <meshBasicMaterial
          color={"#E0E0E0"} // Light grey/off-white color for the description
          depthTest={false}
          depthWrite={false}
        />
      </Text>

      {/* Main scene elements */}
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
      {/* Ambient Sound from MP3 */}
      {/* The PositionalAudio component will load and play the sound from the URL. */}
      {/* Ensure ambientSoundUrl is not empty and points to a valid MP3. */}
      {ambientSoundUrl &&
        !audioError && ( // Only render if URL is set and no critical audio error
          <PositionalAudio
            url={ambientSoundUrl}
            autoplay={true}
            loop={true}
            distance={30} // Increased distance for a more ambient feel. Adjust as needed.
            // position={[0, 0, 0]} // Sound source position, defaults to parent.
            volume={0.3} // Adjust volume (0 to 1). Start with a lower volume for ambient sounds.
          />
        )}
      {/* Display audio error message if any */}
      {audioError && (
        <Text
          color="red"
          fontSize={0.5}
          position={[0, -2, 0]} // Position it somewhere visible
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
