// src/components/ParfumeStage.jsx
import { useRef, useState, useEffect } from "react";
import { MeshPortalMaterial, RoundedBox, useTexture, useCursor, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easing } from "maath";
import { fadeIn, fadeOut } from "../utils/audioEffects";

export const ParfumeStage = ({
  children,
  texture,
  name,
  color,
  active,
  setActive,
  spraying,
  setSpraying,
  soundUrl,
  listener,
  ...props
}) => {
  const map = useTexture(texture);
  const portalMaterial = useRef();
  const [hovered, setHovered] = useState(false);
  const [soundReady, setSoundReady] = useState(false);
  const soundRef = useRef();
  const meshRef = useRef(); // Ref for the RoundedBox to get its world position

  useCursor(hovered);

  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
  });

  useEffect(() => {
    if (listener && soundUrl) {
      const sound = new THREE.PositionalAudio(listener);
      const loader = new THREE.AudioLoader();
      loader.load(soundUrl, (buffer) => {
        sound.setBuffer(buffer);
        sound.setRefDistance(1); // How close the camera needs to be to hear it at full volume
        sound.setRolloffFactor(2); // How quickly the sound fades with distance
        soundRef.current = sound;
        setSoundReady(true);
         // Attach sound to the mesh so it's positioned correctly
        if (meshRef.current) {
          meshRef.current.add(sound);
        }
      });
      return () => {
        if (soundRef.current) {
            if (soundRef.current.isPlaying) {
                soundRef.current.stop();
            }
            if (meshRef.current) {
                meshRef.current.remove(soundRef.current);
            }
            soundRef.current.disconnect();
        }
      };
    }
  }, [listener, soundUrl, meshRef]);

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    if (soundRef.current && soundReady && !soundRef.current.isPlaying && active !== name) {
      fadeIn(soundRef.current, 300, 0.3);
    }
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    if (soundRef.current && soundRef.current.isPlaying && active !== name) {
      fadeOut(soundRef.current, 300);
    }
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setActive(active === name ? null : name);
     if (active === name && soundRef.current?.isPlaying) { // If closing and sound is playing
        fadeOut(soundRef.current, 200);
    } else if (active !== name && soundRef.current && soundReady) { // If opening
        fadeIn(soundRef.current, 500, 0.6); // Louder when active
    }
  };

  const handleClick = (e) => {
    e.stopPropagation(); // Prevent click from bubbling to parent if portal is open
    if (active === name) { // Only allow spraying if this portal is active
      setSpraying(name);
    } else if (active === null) { // If no portal is active, a single click can activate this one
      setActive(name);
      if (soundRef.current && soundReady) {
        fadeIn(soundRef.current, 500, 0.6);
      }
    }
  };


  return (
    <group {...props}>
      <Text
        font="/fonts/NotoSerif.ttf" // Ensure this path is correct relative to your public folder
        fontSize={0.3}
        fontWeight="900"
        position={[0, -1.8, 0.051]} // Adjusted position for better visibility
        anchorY="bottom"
        anchorX="center"
      >
        {name.toUpperCase()}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <RoundedBox
        name={name} // Important for camera focusing and state management
        args={[2, 3, 0.1]} // width, height, depth
        radius={0.05}
        smoothness={4}
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onDoubleClick={handleDoubleClick} // Focus/Enter portal
        onClick={handleClick} // Trigger spray or activate if not focused
      >
        <MeshPortalMaterial ref={portalMaterial} side={THREE.DoubleSide} blend={0}>
          <ambientLight intensity={1} />
          {/* The 3D model and environment specific to this portal */}
          {children}
          {/* Background sphere for the portal */}
          <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};