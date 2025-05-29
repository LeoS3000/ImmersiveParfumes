import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  useGLTF,
  useAnimations,
  MeshTransmissionMaterial,
  shaderMaterial,
  useTexture,
} from "@react-three/drei"; // Added useTexture
import { useThree, useFrame, extend } from "@react-three/fiber"; // Added extend
import { useDrag } from "@use-gesture/react";
import * as THREE from "three";
import { GpuPerfumeSpray } from "./GpuPerfumeSpray";
// Remove PerfumeLiquidMaterial if it's being replaced by LiquidShaderMaterial
// import { PerfumeLiquidMaterial } from './liquidMaterial'
import { LiquidShaderMaterial } from "./liquidMaterial"; // Import the new material

export function Ocean(props) {
  const group = useRef();
  const { nodes, materials, animations } = useGLTF("/models/ocean.glb");
  const { actions, names: animationNames } = useAnimations(animations, group);
  const liquidMaterialRef = useRef(); // Ref for the custom shader material
  const [roughnessMapCapBase, roughnessMapCap, roughnessMapNozzle] = useTexture(
    [
      "textures/RoughnessMapCapBase.png",
      "textures/RoughnessMapCap.png",
      "textures/RoughnessMapNozzle.png",
    ]
  );
  // Load the rim gradient texture
  const rimGradientTexture = useTexture("/textures/liquid_rim_gradient.png"); // <--- UPDATE PATH HERE

  // Uniform values for the liquid shader (can be state or props)
  const [liquidUniforms] = useState({
    liquid_height: 0.4, // Adjust based on your model's liquid level (0 to 1 roughly, relative to mesh height)
    liquid_surface_color: new THREE.Color(0.2, 0.5, 0.9), // Example: blueish
    liquid_alpha: 0.75, // Separate alpha for clarity
    // liquid_rim_gradient: rimGradientTexture, // Texture will be assigned directly
    rim_emission_intensity: 2.0,
    rim_exponent: 4.0,
    emission_intensity: 0.2,
    liquid_surface_gradient_size: 0.05, // How soft the edge of the liquid surface is
    wobble: new THREE.Vector2(0, 0), // Initial wobble
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

  const { initialRotation = [0, 0, 0], ...restProps } = props;
  const [rotation, setRotation] = useState(initialRotation);
  const { size, gl } = useThree();
  const perfumeSprayRef = useRef();

  // Update shader uniforms in useFrame
  useFrame((state, delta) => {
    if (liquidMaterialRef.current) {
      // Example wobble effect - you can tie this to mouse movement, physics, etc.
      const time = state.clock.getElapsedTime();
      liquidMaterialRef.current.uniforms.wobble.value.x =
        Math.sin(time * 2.0) * 0.02; // Adjust frequency and amplitude
      liquidMaterialRef.current.uniforms.wobble.value.y =
        Math.cos(time * 1.5) * 0.02; // Adjust frequency and amplitude

      // The vYcoordinate in the shader is calculated relative to the object's origin.
      // If your liquid_height is also relative to the object's local space, it might not need dynamic updates here
      // unless the overall scale or liquid amount changes.

      // The cameraPosition uniform from your original useFrame is not present in the provided shaders.
      // vViewPosition (vertex position in view space) is used instead for Fresnel.
    }
  });

  useEffect(() => {
    console.log(
      "Available animation names from useAnimations:",
      animationNames
    );
    if (actions.CapPop) {
      console.log('Animation "CapPop" is ready.');
    } else {
      console.warn(
        'Animation "CapPop" not found. Available names:',
        animationNames
      );
    }
    if (actions.Spray) {
      console.log('Animation "Spray" is ready.');
    } else {
      console.warn(
        'Animation "Spray" not found. Available names:',
        animationNames
      );
    }
  }, [actions, animationNames]);

  useEffect(() => {
    const CapPopAction = actions.CapPop;
    if (CapPopAction) {
      CapPopAction.setLoop(THREE.LoopOnce);
      CapPopAction.clampWhenFinished = true;
    }
  }, [actions.CapPop]);

  useEffect(() => {
    const sprayAction = actions.Spray;
    if (sprayAction) {
      sprayAction.setLoop(THREE.LoopOnce);
      sprayAction.clampWhenFinished = true;
    }
  }, [actions.Spray]);

  useEffect(() => {
    if (group.current) {
      group.current.rotation.x = rotation[0];
      //group.current.rotation.y = rotation[1];
      group.current.rotation.z = rotation[2];
    }
  }, [rotation]);

  const bind = useDrag(({ active, movement: [mx, my], memo, first }) => {
    let newRotationX, newRotationY;
    if (active) {
      const baseRotationX = memo ? memo[0] : rotation[0];
      const baseRotationY = memo ? memo[1] : rotation[1];
      const sensitivity = Math.PI * 2;
      newRotationX = baseRotationX + (my / size.height) * sensitivity;
      newRotationY = baseRotationY + (mx / size.width) * sensitivity;
      setRotation([newRotationX, newRotationY, memo ? memo[2] : rotation[2]]);
    }
    if (first) return [...rotation];
    return memo;
  }, {});

  useEffect(() => {
    const canvas = gl.domElement;
    const oldTouchAction = canvas.style.touchAction;
    canvas.style.touchAction = "none";
    return () => {
      canvas.style.touchAction = oldTouchAction;
    };
  }, [gl]);

  const handleCapClick = (event) => {
    event.stopPropagation();
    const CapPopAction = actions.CapPop;
    if (CapPopAction) {
      CapPopAction.reset().play();
    } else {
      console.warn('"CapPop" animation action not found when trying to play.');
    }
  };

  const handleNozzleClick = (event) => {
    event.stopPropagation();
    const sprayAction = actions.Spray;
    if (sprayAction) {
      sprayAction.reset().play();
      if (perfumeSprayRef.current) {
        perfumeSprayRef.current.start();
      }
    } else {
      console.warn('"Spray" animation action not found when trying to play.');
    }
  };

  // Memoize the combined surface color and alpha for the shader
  const liquidSurfaceColorVec4 = useMemo(() => {
    return new THREE.Vector4(
      liquidUniforms.liquid_surface_color.r,
      liquidUniforms.liquid_surface_color.g,
      liquidUniforms.liquid_surface_color.b,
      liquidUniforms.liquid_alpha
    );
  }, [liquidUniforms.liquid_surface_color, liquidUniforms.liquid_alpha]);

  return (
    <group ref={group} {...props} {...bind()} dispose={null}>
      <group name="Scene">
        <mesh
          name="Bottle"
          geometry={nodes.Bottle.geometry}
          // material={materials['Material.001']} // You might want to keep or replace this
          scale={[1, 1.239, 1]}
        >
          <MeshTransmissionMaterial {...config} />
        </mesh>
        <mesh
          name="Liquid"
          geometry={nodes.Liquid.geometry}
          // material={materials['Material.002']} // We are replacing this
          scale={[0.95, 1.2, 0.95]}
        >
          {/* Apply the custom liquid shader material */}
          <liquidShaderMaterial
            ref={liquidMaterialRef}
            attach="material" // Important: use attach="material"
            liquid_height={liquidUniforms.liquid_height}
            liquid_surface_color={liquidSurfaceColorVec4} // Pass the vec4 directly
            liquid_rim_gradient={rimGradientTexture}
            rim_emission_intensity={liquidUniforms.rim_emission_intensity}
            rim_exponent={liquidUniforms.rim_exponent}
            emission_intensity={liquidUniforms.emission_intensity}
            liquid_surface_gradient_size={
              liquidUniforms.liquid_surface_gradient_size
            }
            // The 'wobble' uniform will be updated in useFrame
            // For other uniforms, if they change, make sure they are reactive (state or props)
            transparent={true} // Enable transparency if your liquid_surface_color.a < 1
            side={THREE.DoubleSide} // Important for seeing back faces as per your shader logic
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
          onPointerDown={handleNozzleClick}
        >
          <mesh
            name="Cylinder.002"
            geometry={nodes.Mesh_3.geometry}
          >
            <meshStandardMaterial
            metalness={1.0}
            color={"#E7E7E7"}
            roughnessMap={roughnessMapCap}
          />
            </mesh>
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
          onPointerDown={handleCapClick}
        >
          <meshStandardMaterial
            metalness={1.0}
            color={"#E7E7E7"}
            roughnessMap={roughnessMapCap}
          />
        </mesh>
      </group>
    </group>
  );
}

useGLTF.preload("/models/ocean.glb");
// No need for a separate PerfumeLiquidMaterial if LiquidShaderMaterial replaces it
// extend({ PerfumeLiquidMaterial });
