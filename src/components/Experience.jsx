import {
  Environment,
  MeshPortalMaterial,
  OrbitControls,
  RoundedBox,
  useTexture,
  useCursor,
  CameraControls,
  Text,
  Billboard,
  useVideoTexture,
  Float
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,


  // Noise, Outline, etc.
} from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Jumbo } from "./jumbo";
import { Club } from "./club";
import { Meadow } from "./meadow";
import { easing } from "maath";
import { fadeIn, fadeOut } from "./fadeIn";
import { Ocean } from "./ocean"

export const Experience = () => {
  const [active, setActive] = useState(null);
  const { camera } = useThree();
  const listener = useRef(new THREE.AudioListener());
  const controlsRef = useRef();
  const scene = useThree((state) => state.scene);
  const [hovered, setHovered] = useState(null);


   const allowUserInput = () => {
      controlsRef.enablePan = true;
      controlsRef.enableRotate = true;
    };

      const blockUserInput = () => {
      controlsRef.enablePan = false;
      controlsRef.enableRotate = false;
    };


  useEffect(() => {
    camera.add(listener.current);
    return () => camera.remove(listener.current);
  }, [camera]);

  useEffect(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targetPosition);
      controlsRef.current.setLookAt(
          // Adjust camera position as needed for the "focused" view
          0, 
          0, // Slightly above the target's center
          5, // Closer to the target
          targetPosition.x,
          targetPosition.y,
          targetPosition.z,
          true // Enable smooth transition
        );
        blockUserInput();
    } else {
      controlsRef.current.setLookAt(
        0, 0, 10, // Default camera position
        0, 0, 0,  // Default lookAt target
        true      // Enable smooth transition
      );
      allowUserInput();
    }
  }, [active, scene]);
  
  return (
    <>
      <ambientLight intensity={3000} />
      <Environment preset="sunset" />
      <CameraControls maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 6} ref={controlsRef} />

      <ParfumeStage
        texture="/textures/M.mp4"
        position-z={-0.3}
        soundUrl="/sounds/meadow.mp3"
        listener={listener.current}
        name="on the meadow"
        color="green"
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Float
          speed={1} // Animation speed, defaults to 1
          rotationIntensity={1} // XYZ rotation intensity, defaults to 1
          floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
          floatingRange={[1, 10]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
        >
        <Ocean scale={0.6} position-y={-0.5} rotation-y={Math.PI} hovered={hovered === "on the meadow"}/>
        </Float>

      </ParfumeStage>
    </>
  );
};

const ParfumeStage = ({ 
  children, 
  texture, 
  name, 
  color, 
  active, 
  setActive,
  soundUrl, 
  listener, 
  onSpray, 
  ...props 
}) => {
  const map = useVideoTexture(texture);
  const portalMaterial = useRef();
  const [hovered, setHovered] = useState(false);
  const [soundReady, setSoundReady] = useState(false);
  const soundRef = useRef();
  const meshRef = useRef();
  useCursor(hovered);

  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta)
  })

  useEffect(() => {
    if (listener && soundUrl) {
      const sound = new THREE.PositionalAudio(listener);
      const loader = new THREE.AudioLoader();
      loader.load(soundUrl, (buffer) => {
        sound.setBuffer(buffer);
        sound.setRefDistance(2);
        soundRef.current = sound;
        setSoundReady(true);
      });
    }
  }, [listener, soundUrl]);

  const handlePointerOver = () => {
    setHovered(true);
    if (soundRef.current && soundReady && !soundRef.current.isPlaying) {
      fadeIn(soundRef.current, 500, 0.5);
    }
  };

  const handlePointerOut = () => {
    setHovered(false);
    if (soundRef.current && soundRef.current.isPlaying) {
      fadeOut(soundRef.current, 500);
    }
  };

  

  return (
    <group {...props} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      <Text font="fonts/NotoSerif.ttf" fontSize={0.3} fontWeight="900" position={[0, -1.3, 0.051]} anchorY="bottom">
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <RoundedBox
        name={name}
        args={[2, 3, 0.1]}
        radius={0.05}
        smoothness={4}
        scale={1}
        ref={meshRef}
        onDoubleClick={() => setActive(active === name ? null : name)}
      >
        <MeshPortalMaterial
          ref={portalMaterial}
          side={THREE.DoubleSide}
        >
          
          {/* Content of your portal */}
          {children} {/* This is where your ocean model or other scene would go */}
          <mesh> {/* This seems to be a background sphere for the portal */}
            <Environment preset="sunset" background blur={0.5} />
            <sphereGeometry args={[5, 32, 32]} />
            <meshStandardMaterial
              map={map}
              side={THREE.BackSide}
            />
                      <ambientLight intensity={Math.PI} /> {/* Adjusted intensity for example */}

          </mesh>

          {/* 👇 Postprocessing effects specifically for this portal's content 👇 */}
          <EffectComposer multisampling={0}> {/* multisampling can be adjusted */}
            <Bloom
              intensity={2.8}
              kernelSize={KernelSize.MEDIUM}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.2}
            />
            <Vignette
              eskil={false}
              offset={0.1}
              darkness={0.9}
            />
            <Noise opacity={0.03} />

            {/* Add more effects here as needed, e.g., <Noise opacity={0.05} /> */}
          </EffectComposer>
          {/* End of postprocessing effects for the portal */}

        </MeshPortalMaterial>
        {/* This sound part seems to be outside the portal, on the RoundedBox itself */}
        {soundReady && soundRef.current && <primitive object={soundRef.current} />}
      </RoundedBox>
    </group>
  );
};


