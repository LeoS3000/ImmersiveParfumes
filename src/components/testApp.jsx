import {
  AccumulativeShadows,
  Center,
  Clouds,
  ContactShadows,
  Environment,
  OrbitControls,
  RandomizedLight,
  Sky,
  Text, // This Text is for inside the Canvas
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
import { useState, useEffect } from "react";
import { AnimatedGroup } from "./components/animatedGroup";
import { Peach } from "./components/peach";
import { Ambient } from "./components/ambient";
import * as Tone from "tone";

// Placeholder components (actual implementations are in your local files)
const PlaceholderMesh = ({ text, position = [0,0,0], ...props }) => (
  <mesh position={position} {...props}>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="orange" />
    {text && <Text position={[0,0.7,0]} fontSize={0.2} color="black" anchorX="center">{text}</Text>}
  </mesh>
);

// Use placeholders if actual components are not available in this environment
const ActualPerfumeBottle = typeof PerfumeBottle !== 'undefined' ? PerfumeBottle : ({ onNozzleClick, ...props }) => (
  <group {...props}>
    <mesh onClick={onNozzleClick} position={[0,0.5,0]}>
      <cylinderGeometry args={[0.3, 0.3, 1, 16]} />
      <meshStandardMaterial color="lightblue" />
    </mesh>
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial color="blue" />
    </mesh>
    <Text position={[0,1.2,0]} fontSize={0.15} color="black" anchorX="center">Perfume (Click Top)</Text>
  </group>
);
const ActualFlowers = typeof Flowers !== 'undefined' ? Flowers : (props) => <PlaceholderMesh text="Flowers" {...props} />;
const ActualPeach = typeof Peach !== 'undefined' ? Peach : (props) => <PlaceholderMesh text="Peach" {...props} />;
const ActualBBOW = typeof BBOW !== 'undefined' ? BBOW : (props) => <PlaceholderMesh text="BBOW" scale={2} position={[0,-2,0]} {...props} />;
const ActualPuffycloud = typeof Puffycloud !== 'undefined' ? Puffycloud : (props) => <PlaceholderMesh text={`Cloud ${props.seed}`} scale={3} {...props} />;
const ActualPointer = typeof Pointer !== 'undefined' ? Pointer : (props) => <PlaceholderMesh text="Pointer" scale={0.5} {...props} />;
const ActualAmbient = typeof Ambient !== 'undefined' ? Ambient : () => <ambientLight intensity={0.5} />;
const ActualAnimatedGroup = typeof AnimatedGroup !== 'undefined' ? AnimatedGroup : ({ children, active, ...props }) => active ? <group {...props}>{children}</group> : null;

// Loading Screen Component
function LoadingScreen() {
  const loadingScreenStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e', 
    color: '#e0e0e0', 
    fontFamily: '"Noto Serif", serif', // Using a common serif font as fallback
    fontSize: '1.5em', // Base font size for the loading screen
    zIndex: 10000, 
    textAlign: 'center',
    padding: '20px',
  };

  const titleTextStyles = {
    fontSize: '1.8em', // Larger font size for the main title
    color: '#ffffff',
    marginBottom: '20px', // Space below the title
    fontWeight: 'bold', // Make title bold
  };

  const spinnerTextStyles = {
    marginTop: '20px',
    fontSize: '0.8em',
    color: '#b3b3b3', 
  };

  const spinnerStyles = {
    border: '8px solid #f3f3f320', 
    borderTop: '8px solid #0077cc', 
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    animation: 'spin 1s linear infinite',
    margin: '20px auto',
  };

  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style> 
      <div style={loadingScreenStyles}>
        {/* Use standard HTML for text in the loading screen */}
        <div style={titleTextStyles}>
            Discovering Your Scent...
        </div>
        <div style={spinnerStyles}></div>
        <p style={spinnerTextStyles}>Please wait a moment.</p>
      </div>
    </>
  );
}


function App() {
  const [isLoading, setIsLoading] = useState(true); 
  const [index, setIndex] = useState(0);
  const [audioError, setAudioError] = useState(null);

  // Path to your sound file, ensure it's in the public folder or served correctly
  const ambientSoundUrl = "/sounds/ocean.mp3"; 

  const scents = [
    <>
      <ActualFlowers key="flowers" position={[5, 0, 0]} />
      <ActualFlowers key="flowers2" position={[0, 0, 4]} />
    </>,
    <>
      <ActualPeach key="Peach" />
      <ActualPeach key="Peach2" position={[-2, 1, 4]} />
      <ActualPeach key="Peach3" position={[-4, 2, 4]} />
      <ActualPeach key="Peach4" position={[-6, 2, 2]} />
      <ActualPeach key="Peach5" position={[-6, 1, 0]} />
      <ActualPeach key="Peach6" position={[-5, 1, -2]} />
    </>,
  ];

  const scentDescriptions = [
    "A delicate bouquet of fresh spring flowers, evoking a sense of renewal and light.",
    "The sweet and succulent aroma of ripe peaches, bursting with juicy sunshine.",
    "The rich and grounding aroma of ancient woods, wrapping you in a warm, earthy embrace that evokes deep tranquility.",
    "A captivating bouquet of freshly bloomed garden roses, its velvety petals unfurling a timeless fragrance of romance and elegant sophistication."
  ];

  // Effect for the loading screen timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 5000); 

    return () => clearTimeout(timer); 
  }, []); 

  const handleExternalNozzle = () => {
    setIndex((prevIndex) => (prevIndex + 1) % scents.length);
  };

  // Effect to initialize AudioContext
  useEffect(() => {
    if (isLoading) return; 

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

    return () => {
      // Optional cleanup: if (Tone.context.state !== 'closed') Tone.context.close();
    };
  }, [isLoading]); 


  // If loading, show the loading screen
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Otherwise, show the main application
  return (
    <Canvas shadows camera={{ position: [15, 9, 15], fov: 35 }}>
      {/* Ambient Light for the scene */}
      <ActualAmbient />
      
      {/* SpotLights for dynamic lighting */}
      <spotLight
        position={[15, 50, 4]}
        angle={0} // A very narrow cone
        decay={0.5}
        distance={100}
        penumbra={1} // Softness of the spotlight edge
        intensity={10000}
        castShadow // Ensure spotlights can cast shadows
      />
      <spotLight
        position={[-4, 10, -5]}
        color="red"
        angle={0.35} // Wider angle
        decay={0.75}
        distance={50}
        penumbra={0.5} // Softer edge
        intensity={300}
        castShadow
      />

      {/* Main Title Text (using R3F Text) */}
      <Text
        font={"/fonts/NotoSerif-Black.ttf"} // Ensure this path is correct (e.g., from public folder)
        renderOrder={999} // High render order to be on top
        position={[0, 6, 0]} // Position of the text
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        fontSize={1} 
      >
        DISCOVER YOUR {"\n"} NEW SCENT
        <meshBasicMaterial
          color={"white"}
          depthTest={false} // Render on top of other objects
          depthWrite={false} // Render on top of other objects
        />
      </Text>

      {/* Dynamic Scent Description Text (using R3F Text) */}
      <Text
        font={"/fonts/NotoSerif-Black.ttf"} // Ensure path is correct
        fontSize={0.45} 
        position={[0, 4.5, 0]} // Positioned below the title
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        maxWidth={10} // Max width before text wraps
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
      
      {/* Billboard component */}
      <Billboard
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
        position={[0, 2, 5]} 
      >
        {/* Optional: <Text fontSize={0.3} color="cyan">Billboard Info</Text> */}
      </Billboard>

      {/* Main scene elements */}
      <ActualBBOW />
      <group position={[0, 0, 0]} rotation={[0, Math.PI * 1.2, 0]}>
        <Center top>
          <ActualPerfumeBottle onNozzleClick={handleExternalNozzle} />
        </Center>

        {scents.map((scent, i) => (
          <Float speed={1} rotationIntensity={3} floatIntensity={2} key={`scent-float-${i}`}>
            <ActualAnimatedGroup active={i === index} fromY={-10} toY={2}>
              {scent}
            </ActualAnimatedGroup>
          </Float>
        ))}

        <AccumulativeShadows
          temporal
          frames={100}
          alphaTest={0.85} 
          color="#005b96"
          colorBlend={1}
          opacity={0.8}
          scale={20}
        >
          <RandomizedLight
            radius={10}
            ambient={0.5}
            intensity={Math.PI} // Light intensity
            position={[2.5, 8, -2.5]}
            bias={0.001}
          />
        </AccumulativeShadows>
      </group>

      {/* OrbitControls for camera interaction */}
      <OrbitControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.01} // Limit looking from below
        autoRotate
        autoRotateSpeed={0.1} 
        makeDefault
        enableZoom={false}
        enablePan={false}
      />

      {/* Clouds with Physics */}
      <Clouds limit={400} material={THREE.MeshLambertMaterial}>
        <Physics gravity={[0, 0, 0]}>
          <ActualPointer />
          {[...Array(8)].map((_, i) => (
            <ActualPuffycloud key={`cloud-${i}`} seed={(i + 1) * 10} position={[Math.random() * 40 - 20, Math.random() * 20, Math.random() * 40 - 20]} />
          ))}
          <CuboidCollider position={[0, -15, 0]} args={[400, 10, 400]} /> {/* Ground collider */}
        </Physics>
      </Clouds>

      {/* ContactShadows for ground shadows */}
      <ContactShadows
        opacity={0.35} 
        color="black"
        position={[0, -10, 0]} // Ensure this is on your ground plane
        scale={50}
        blur={3} 
        far={40}
      />

      {/* Sky component for background */}
      <Sky
        scale={1000}
        sunPosition={[500, 150, -1000]} // Sun position
        turbidity={8} 
        rayleigh={3} 
        mieCoefficient={0.005} 
        mieDirectionalG={0.75} 
      />

      {/* Environment lighting from an HDR file */}
      <Environment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr"
        background
        backgroundBlurriness={0.5}
      />

      {/* Ambient Sound using PositionalAudio */}
      {ambientSoundUrl && !audioError && (
        <PositionalAudio
          url={ambientSoundUrl}
          autoplay={true} 
          loop={true}
          distance={30} // How far the sound travels
          volume={0.2} 
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

