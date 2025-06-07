import { useRef, useState, useEffect, useMemo } from "react";
import {
  useGLTF,
  useAnimations,
  MeshTransmissionMaterial,
  useTexture,
  PositionalAudio,
} from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber"; // useThree for viewport size
import * as THREE from "three";
import { GpuPerfumeSpray } from "./GpuPerfumeSpray";
import { LiquidShaderMaterial } from "./liquidMaterial";
import { motion, useMotionValue, animate } from "framer-motion";

export function PerfumeBottle(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/ocean.glb");
  const { actions, names: animationNames } = useAnimations(animations, group);
  const liquidMaterialRef = useRef();
  const sprayRef = useRef();
  const capPopRef = useRef();
  const [roughnessMapCapBase, roughnessMapCap, roughnessMapNozzle] = useTexture(
    [
      "textures/RoughnessMapCapBase.png",
      "textures/RoughnessMapCap.png",
      "textures/RoughnessMapNozzle.png",
    ]
  );
  const rimGradientTexture = useTexture("/textures/liquid_rim_gradient.png");

  const [liquidUniforms] = useState({
    liquid_height: 0.4,
    liquid_surface_color: new THREE.Color(0.2, 0.5, 0.9),
    liquid_alpha: 0.75,
    rim_emission_intensity: 2.0,
    rim_exponent: 4.0,
    emission_intensity: 0.2,
    liquid_surface_gradient_size: 0.05,
    wobble: new THREE.Vector2(0, 0),
  });

  const config = {
    meshPhysicalMaterial: false,
    transmissionSampler: false,
    backside: false,
    samples: 10,
    resolution: 2048,
    transmission: 1,
    roughness: 0.0,
    thickness: 0.5,
    ior: 1.5,
    chromaticAberration: 0.06,
    anisotropy: 0.1,
    distortion: 0.0,
    distortionScale: 0.3,
    temporalDistortion: 0.5,
    clearcoat: 1,
    attenuationDistance: 0.5,
    attenuationColor: "#ffffff",
    color: "#c9ffa1",
    bg: "#839681",
  };

  const { initialRotation = [0, 0, 0], onNozzleClick, onHoverChange, ...restProps } = props;
  const rotationX = useMotionValue(initialRotation[0]);
  const rotationY = useMotionValue(initialRotation[1]);
  const rotationZ = useMotionValue(initialRotation[2]);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { size } = useThree(); // For viewport-relative sensitivity
  const perfumeSprayRef = useRef();

  // Ref to store the last mouse position for delta calculation
  const lastMousePos = useRef({ x: 0, y: 0 });

  // This useEffect applies the `rotation` state (initial, programmatic, or last hover rotation)
  // to the model, but only if it's not currently being interacted with via hover.
  useEffect(() => {
    if (group.current && !isHovering) {
      group.current.rotation.x = rotationX.get();
      group.current.rotation.y = rotationY.get();
      group.current.rotation.z = rotationZ.get();
    }
  }, [isHovering, rotationX, rotationY, rotationZ]);

  useFrame(() => {
    // Liquid wobble logic
    if (liquidMaterialRef.current) {
      const time = performance.now() / 1000;
      liquidMaterialRef.current.uniforms.wobble.value.x =
        Math.sin(time * 2.0) * 0.02;
      liquidMaterialRef.current.uniforms.wobble.value.y =
        Math.cos(time * 1.5) * 0.02;
    }
    // Animate group rotation with Framer Motion values
    if (group.current) {
      group.current.rotation.x = rotationX.get();
      group.current.rotation.y = rotationY.get();
      group.current.rotation.z = rotationZ.get();
    }
  });

  useEffect(() => {
    console.log(
      "Available animation names from useAnimations:",
      animationNames
    );
    // ... (rest of your animation logging)
  }, [actions, animationNames]);

  // This useEffect for CapPop animation and sound is from your original code
  useEffect(() => {
    const CapPopAction = actions.CapPop;
    if (CapPopAction) {
      CapPopAction.setLoop(THREE.LoopOnce);
      CapPopAction.clampWhenFinished = true;
      if (capPopRef.current && typeof capPopRef.current.play === "function") {
        // Consider if this auto-play on load is desired.
        // If you only want sound on click, remove the next line.
        // capPopRef.current.play(); // This was in your original code, plays sound when animation is ready
      }
    }
  }, [actions.CapPop]);


  useEffect(() => {
    const sprayAction = actions.Spray;
    if (sprayAction) {
      sprayAction.setLoop(THREE.LoopOnce);
      sprayAction.clampWhenFinished = true;
    }
  }, [actions.Spray]);


  const handlePointerDown = (event) => {
    event.stopPropagation();
    setIsDragging(true);
    setIsHovering(true);
    if (onHoverChange) onHoverChange(true);
    lastMousePos.current = { x: event.clientX, y: event.clientY };
    event.target.style.cursor = 'grabbing';
  };

  const handlePointerUp = (event) => {
    event.stopPropagation();
    setIsDragging(false);
    setIsHovering(false);
    if (onHoverChange) onHoverChange(false);
    event.target.style.cursor = 'auto';
  };

  const handlePointerMove = (event) => {
    event.stopPropagation();
    if (isDragging && group.current) {
      const currentX = event.clientX;
      const currentY = event.clientY;
      const deltaX = currentX - lastMousePos.current.x;
      const deltaY = currentY - lastMousePos.current.y;
      // Increase sensitivity for more responsive rotation
      const sensitivityX = (Math.PI * 6.0) / size.width;  // Y-axis (horizontal drag)
      const sensitivityY = (Math.PI * 6.0) / size.height; // X-axis (vertical drag)
      // Invert deltaY for natural feel
      let newY = rotationY.get() + deltaX * sensitivityX;
      let newX = rotationX.get() - deltaY * sensitivityY;
      // Allow full rotation (no clamp)
      animate(rotationY, newY, { type: "spring", stiffness: 200, damping: 30 });
      animate(rotationX, newX, { type: "spring", stiffness: 200, damping: 30 });
      lastMousePos.current = { x: currentX, y: currentY };
    }
  };

  const handleCapClick = (event) => {
    event.stopPropagation();
    const CapPopAction = actions.CapPop;
    if (CapPopAction) {
      CapPopAction.reset().play();
      if (capPopRef.current && typeof capPopRef.current.play === "function") {
        capPopRef.current.play(); // Play sound on click
      }
    } else {
      console.warn('"CapPop" animation action not found when trying to play.');
    }
  };

  const handleNozzleClick = (event) => {
    event.stopPropagation();
    // ... (rest of your nozzle click logic) ...
    const sprayAction = actions.Spray;
    if (sprayAction) {
      sprayAction.reset().play();
      if (perfumeSprayRef.current) {
        perfumeSprayRef.current.start();
      }
    } else {
      console.warn('"Spray" animation action not found when trying to play.');
    }
    if (sprayRef.current && typeof sprayRef.current.play === "function") {
      sprayRef.current.play();
    }

    if (typeof onNozzleClick === "function") {
      onNozzleClick(event);
    }
  };

  const liquidSurfaceColorVec4 = useMemo(() => {
    return new THREE.Vector4(
      liquidUniforms.liquid_surface_color.r,
      liquidUniforms.liquid_surface_color.g,
      liquidUniforms.liquid_surface_color.b,
      liquidUniforms.liquid_alpha
    );
  }, [liquidUniforms.liquid_surface_color, liquidUniforms.liquid_alpha]);

  return (
    <group
      ref={group}
      {...restProps}
      dispose={null}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <group name="Scene">
        <mesh
          name="Bottle"
          geometry={nodes.Bottle.geometry}
          scale={[1, 1.239, 1]}
        >
          <MeshTransmissionMaterial {...config} />
        </mesh>
        <mesh
          name="Liquid"
          geometry={nodes.Liquid.geometry}
          scale={[0.95, 1.2, 0.95]}
        >
          <liquidShaderMaterial
            ref={liquidMaterialRef}
            attach="material"
            liquid_height={liquidUniforms.liquid_height}
            liquid_surface_color={liquidSurfaceColorVec4}
            liquid_rim_gradient={rimGradientTexture}
            rim_emission_intensity={liquidUniforms.rim_emission_intensity}
            rim_exponent={liquidUniforms.rim_exponent}
            emission_intensity={liquidUniforms.emission_intensity}
            liquid_surface_gradient_size={
              liquidUniforms.liquid_surface_gradient_size
            }
            transparent={true}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh
          name="Bottle2"
          geometry={nodes.Bottle2.geometry}
          scale={[1, 1.239, 1]}
        >
          <meshStandardMaterial
            metalness={1.0}
            color={"#E7E7E7"}
            roughnessMap={roughnessMapCapBase}
          />
        </mesh>
        <group
          name="nozzle"
          position={[0, 2.754, 0]}
          scale={[0.236, 0.317, 0.236]}
          onPointerDown={handleNozzleClick} // Changed from onClick to onPointerDown for consistency
        >
          <mesh name="Cylinder.002" geometry={nodes.Mesh_3.geometry}>
            <meshStandardMaterial
              metalness={1.0}
              color={"#E7E7E7"}
              roughnessMap={roughnessMapCap}
            />
          </mesh>
          <PositionalAudio
            ref={sprayRef}
            url="./sounds/Spray.mp3"
            distance={5}
            loop={false}
            autoplay={false}
            volume={1}
            playbackRate={1}
          />
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <GpuPerfumeSpray
              ref={perfumeSprayRef}
              origin={[0, 1.4, 0.25]}
              sprayDuration={0.3}
              particleCount={1000}
            />
          </group>
          <mesh
            name="Mesh_4"
            geometry={nodes.Mesh_4.geometry}
            material={materials["cap.002"]}
          />
        </group>
        <mesh
          name="Cap"
          geometry={nodes.Cap.geometry}
          material={materials.cap}
          position={[0, 2.964, 0]}
          scale={[1, 1.239, 1]}
          onPointerDown={handleCapClick} // Changed from onClick to onPointerDown for consistency
        >
          <meshStandardMaterial
            metalness={1.0}
            color={"#E7E7E7"}
            roughnessMap={roughnessMapCap}
          />
          <PositionalAudio // Sound associated with the cap
            ref={capPopRef}
            url="./sounds/CapPop.mp3"
            distance={5}
            loop={false}
            autoplay={false} // Sound will be played via handleCapClick
            volume={1}
            playbackRate={1}
          />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/models/ocean.glb");