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
  FaceLandmarker,
  FaceControls
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { CuboidCollider, Physics } from "@react-three/rapier";
import * as THREE from "three";
import { BBOW } from "./components/bbow";
import { PerfumeBottle } from "./components/ocean";
import { Puffycloud } from "./components/PuffyCloud";
import { Pointer } from "./components/pointer";
import { Flowers } from "./components/flowers";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { AnimatedGroup } from "./components/animatedGroup";
import { Peach } from "./components/peach";
import { Wood } from "./components/wood";
import * as Tone from "tone";
import { CameraLogger } from "./components/camLogger";
import { StaticOverlay } from "./components/staticOverlay";
import { useMotionValue, useSpring } from "framer-motion";
import { Alge } from "./components/Alge";
import { Rose } from "./components/Rose";
import { OtherFlower } from "./components/OtherFlower";
import { Html } from "@react-three/drei";
import { useNavigate } from 'react-router-dom';


function App() {
  const orbitRef = useRef();
  const [index, setIndex] = useState(0);
  const [audioError, setAudioError] = useState(null);
  // --- NEW: State to control the static overlay ---
  const [showOverlay, setShowOverlay] = useState(true);
  const navigate = useNavigate();

  const handleCloudRise = () => {
    console.log("A cloud has risen!");
  };

  const ambientSoundUrl = "/sounds/ocean.mp3";

  // --- Framer Motion mouse tracking for floating effect ---
  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0)
  };
  const smoothMouse = {
    x: useSpring(mouse.x, { stiffness: 75, damping: 100, mass: 3 }),
    y: useSpring(mouse.y, { stiffness: 75, damping: 100, mass: 3 })
  };
  useEffect(() => {
    // Define a smaller, more central area for subtle mouse effect
    const area = {
      xMin: 0.45, // 45% from left
      xMax: 0.55, // 55% from left
      yMin: 0.45, // 45% from top
      yMax: 0.55  // 55% from top
    };
    const manageMouse = (e) => {
      const { innerWidth, innerHeight } = window;
      const { clientX, clientY } = e;
      const x = clientX / innerWidth;
      const y = clientY / innerHeight;
      if (x >= area.xMin && x <= area.xMax && y >= area.yMin && y <= area.yMax) {
        // Remap x/y from area to [0,1] for the effect
        const mappedX = (x - area.xMin) / (area.xMax - area.xMin);
        let mappedY = (y - area.yMin) / (area.yMax - area.yMin);
        // Cap mappedY to prevent models from floating too high
        mappedY = Math.min(mappedY, 0.7);
        mouse.x.set(mappedX);
        mouse.y.set(mappedY);
      } else {
        // Snap back to center if outside area for smooth reset
        mouse.x.set(0.5);
        mouse.y.set(0.5);
      }
    };
    window.addEventListener("mousemove", manageMouse);
    return () => window.removeEventListener("mousemove", manageMouse);
  }, []);

  const subtleMultiplier = 0.5;

  const scents = useMemo(() => [
    <></>,
    // Peaches: sweet, juicy, summery scent
    // Description: The sweet and succulent aroma of ripe peaches, bursting with juicy sunshine.
    [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]
    ].map((_, i, arr) => {
      const angle = (i / arr.length) * Math.PI * 2;
      const radius = 2;
      const y = 1.5 + Math.sin(angle * 2) * 1.5;
      return (
        <Float key={`peach${i}`} speed={1.2 + i * 0.1} rotationIntensity={2.2} floatIntensity={1.3 + i * 0.1}>
          <Peach
            position={[
              Math.cos(angle) * radius,
              y,
              Math.sin(angle) * radius
            ]}
            mouse={smoothMouse}
            multiplier={subtleMultiplier}
          />
        </Float>
      );
    }),
    // Alge: fresh, aquatic, oceanic scent
    // Description: The invigorating, fresh scent of ocean algae, evoking a cool sea breeze.
    [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]
    ].map((_, i, arr) => {
      const angle = (i / arr.length) * Math.PI * 2;
      const radius = 2.5;
      const y = 1.5 + Math.sin(angle * 2) * 1.2;
      return (
        <Float key={`alge${i}`} speed={1.1 + i * 0.1} rotationIntensity={2.1} floatIntensity={1.1 + i * 0.1}>
          <Alge
            position={[
              Math.cos(angle) * radius,
              y,
              Math.sin(angle) * radius
            ]}
            mouse={smoothMouse}
            multiplier={subtleMultiplier}
          />
        </Float>
      );
    }),
    // Rose: classic, floral, romantic scent
    // Description: A captivating bouquet of freshly bloomed garden roses, its velvety petals unfurling a timeless fragrance.
    [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]
    ].map((_, i, arr) => {
      const angle = (i / arr.length) * Math.PI * 2;
      const radius = 2.5;
      const y = 1.5 + Math.sin(angle * 2) * 1.2;
      return (
        <Float key={`rose${i}`} speed={1.1 + i * 0.1} rotationIntensity={2.1} floatIntensity={1.1 + i * 0.1}>
          <Rose
            position={[
              Math.cos(angle) * radius,
              y,
              Math.sin(angle) * radius
            ]}
            mouse={smoothMouse}
            multiplier={subtleMultiplier}
          />
        </Float>
      );
    }),
    // OtherFlower: wild, colorful, springtime scent
    // Description: A lively mix of wildflowers, bringing the vibrant and uplifting spirit of spring meadows.
    [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]
    ].map((_, i, arr) => {
      const angle = (i / arr.length) * Math.PI * 2;
      const radius = 2.5;
      const y = 1.5 + Math.sin(angle * 2) * 1.2;
      return (
        <Float key={`otherflower${i}`} speed={1.1 + i * 0.1} rotationIntensity={2.1} floatIntensity={1.1 + i * 0.1}>
          <OtherFlower
            position={[
              Math.cos(angle) * radius,
              y,
              Math.sin(angle) * radius
            ]}
            mouse={smoothMouse}
            multiplier={subtleMultiplier}
          />
        </Float>
      );
    })
  ], [smoothMouse]);

  const scentDescriptions = useMemo(() => [
    "",
    // Peaches
    "The sweet and succulent aroma of ripe peaches, bursting with juicy sunshine.",
    // Alge
    "The invigorating, fresh scent of ocean algae, evoking a cool sea breeze.",
    // Rose
    "A captivating bouquet of freshly bloomed garden roses, its velvety petals unfurling a timeless fragrance.",
    // OtherFlower
    "A lively mix of wildflowers, bringing the vibrant and uplifting spirit of spring meadows."
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
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {index >= scentDescriptions.length - 1 && (
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 80,
          transform: 'translateX(-50%)',
          zIndex: 10
        }}>
          <button
            style={{
              background: '#fff',
              color: '#111827',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.75rem 1.5rem',
              fontSize: '1.2rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onClick={() => navigate('/product')}
          >
            Zum Produkt
          </button>
        </div>
      )}
      <Canvas
        shadows
        camera={{
          position: [7, 3.5, 28],
          fov: 35,
          rotation: [Math.PI * 0.2, Math.PI * 0.8, 0]
        }}
        style={{ width: '100vw', height: '100vh' }}
      >
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
        {/* Scent Description */}
        {index < scentDescriptions.length - 1 ? (
          <Text
            renderOrder={999}
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
              color="#fff"
              depthTest={false}
              depthWrite={false}
              toneMapped={false}
            />
          </Text>
        ) : null}
        <BBOW />
        <group position={[3, 0, 3]} rotation={[0, Math.PI * 1.2, 0]}>
          <Center top>
            <PerfumeBottle
              onNozzleClick={handleExternalNozzle}
              onHoverChange={hovering => {
                if (orbitRef.current) orbitRef.current.enabled = !hovering;
              }}
            />
          </Center>

          {scents.map((scent, i) => (
            <AnimatedGroup key={i} active={i === index} fromY={-10} toY={2} renderOrder={1}>
              {scent}
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
          ref={orbitRef}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2.01}
          autoRotate
          autoRotateSpeed={0.05}
          makeDefault
          enableZoom={true}
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
    </div>
  );
}

// Remove this file's default export and main component logic, as it is now used only as an import by Home.jsx.

export default App;