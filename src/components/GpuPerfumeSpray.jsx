import * as THREE from 'three';
import React, { useRef, useMemo, useImperativeHandle, forwardRef } from 'react'; // Added forwardRef
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';

// Assuming your shader files are correctly pathed
import vertex from '../shaders/mist.vert'; // Path to your vertex shader
import fragment from '../shaders/mist.frag'; // Path to your fragment shader

// Define the custom shader material (same as original)
const MistMaterial = shaderMaterial(
  {
    uTime: 0,
    uOrigin: new THREE.Vector3(0, 0, 0),
    uParticleLifespan: 0.3, // How long each particle lives (seconds)
    uSprayConeAngle: 0.06,  // Radians, adjust for wider/narrower spray
    uInitialSpeed: 40.0,      // Initial speed of particles
    uGravity: new THREE.Vector3(0, 0, 0), // Adjusted gravity
    uSpeedVariance: 0.3,
    uDragFactor: 0.3,
    uTurbulenceStrength: 1.05,
    uTurbulenceFrequency: 1.0,
    uBasePointSize: 2.3,
    uPointSizeVariance: 0.25,
    uPerspectiveFactor: 200.0,
    // uParticleTexture: new THREE.Texture(), // Uncomment if you add a texture
  },
  vertex,
  fragment
);

// Make the material available as a JSX component <mistMaterial />
extend({ MistMaterial });

export const GpuPerfumeSpray = forwardRef(({
  origin = [0, 0, 0],    // Default origin of the spray
  sprayDuration = 0.1,    // How long the spray emission lasts when triggered (seconds)
  particleCount = 5000,   // Number of particles in the system
}, ref) => {
  const matRef = useRef();
  const aStartTimeAttributeRef = useRef(); // Ref for the aStartTime bufferAttribute

  // useMemo to create particle attributes only once or when count changes
  const aRandomArray = useMemo(() => {
    const randoms = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      randoms[i] = Math.random();
    }
    return randoms;
  }, [particleCount]);

  const aStartTimeArray = useMemo(() => {
    const startTimes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      startTimes[i] = -10000.0; // Initialize far in the past (effectively dead)
    }
    return startTimes;
  }, [particleCount]);

  const currentParticleIndex = useRef(0); // Tracks the next particle slot to activate
  const sprayBurstStartTime = useRef(0);     // Tracks the time the current spray burst started
  const isSprayingActive = useRef(false);    // State to manage if spraying is active
  const needsToStartSpray = useRef(false); // Flag to initiate spray from imperative call

  // Expose a 'start' method via the ref
  useImperativeHandle(ref, () => ({
    start: () => {
      // Only start a new spray if not already spraying to prevent overlapping bursts from rapid calls.
      // If you want to allow re-triggering (e.g., reset and start immediately),
      // you might remove or modify this condition.
      if (!isSprayingActive.current) {
        needsToStartSpray.current = true;
      }
    }
  }), []); // Empty dependency array ensures the handle is created once

  useFrame((state, delta) => {
    const { clock } = state;
    const currentTime = clock.getElapsedTime();

    // Update material uniforms
    if (matRef.current) {
      matRef.current.uTime = currentTime;
      matRef.current.uOrigin.set(...origin); // Allow origin to be dynamic via props
    }

    // Check if an imperative 'start' call has requested a spray
    if (needsToStartSpray.current) {
      isSprayingActive.current = true;
      sprayBurstStartTime.current = currentTime; // Record the time this burst started
      needsToStartSpray.current = false;         // Reset the flag

      // Optional: Reset particle index to start emission from the beginning of the pool for each new burst.
      // If commented out, subsequent sprays will continue from where the last one left off in the particle array.
      currentParticleIndex.current = 0;
    }

    // If currently spraying, activate particles
    if (isSprayingActive.current) {
      const timeSinceBurstStart = currentTime - sprayBurstStartTime.current;

      if (timeSinceBurstStart < sprayDuration) {
        // Calculate how many particles to activate this frame to spread them over `sprayDuration`.
        const particlesToEmitThisFrame = Math.ceil((particleCount / sprayDuration) * delta);
        let emittedThisFrameCount = 0;

        for (let i = 0; i < particlesToEmitThisFrame; i++) {
          const index = currentParticleIndex.current;
          aStartTimeArray[index] = currentTime; // Set the "birth" time of the particle

          currentParticleIndex.current = (currentParticleIndex.current + 1) % particleCount; // Move to the next particle slot, wrap around
          emittedThisFrameCount++;
        }

        // If any particles were activated, mark the attribute for update
        if (emittedThisFrameCount > 0 && aStartTimeAttributeRef.current) {
          aStartTimeAttributeRef.current.needsUpdate = true;
        }
      } else {
        // Spray duration has ended
        isSprayingActive.current = false;
      }
    }
  });

  return (
    <points>
      <bufferGeometry> {/* geomRef is optional if not directly manipulated post-creation */}
        <bufferAttribute
          attach="attributes-position"
          array={useMemo(() => new Float32Array(particleCount * 3).fill(0), [particleCount])}
          count={particleCount}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          array={aRandomArray}
          count={particleCount}
          itemSize={1}
        />
        <bufferAttribute
          ref={aStartTimeAttributeRef} // Assign ref to the attribute
          attach="attributes-aStartTime"
          array={aStartTimeArray}    // Pass the Float32Array we modify
          count={particleCount}
          itemSize={1}
        />
      </bufferGeometry>
      <mistMaterial
        ref={matRef}
        transparent
        depthWrite={false} // Crucial for correct rendering of transparent particles
        blending={THREE.AdditiveBlending} // Experiment with THREE.NormalBlending or others
      />
    </points>
  );
});

// It's good practice to set a displayName for components wrapped in forwardRef for easier debugging
GpuPerfumeSpray.displayName = 'GpuPerfumeSpray';

/*
// Example of how to use the rewritten component:

import { Canvas, useThree } from '@react-three/fiber'; // useThree might be needed if start() required clock time

function MyScene() {
  const perfumeSprayRef = useRef();

  const handleSprayClick = () => {
    if (perfumeSprayRef.current) {
      perfumeSprayRef.current.start(); // "Call" the animation
    }
  };

  return (
    <>
      <button onClick={handleSprayClick} style={{ position: 'absolute', zIndex: 1 }}>Spray Perfume</button>
      <GpuPerfumeSpray ref={perfumeSprayRef} origin={[0, 1, 0]} sprayDuration={0.2} particleCount={10000} />
    </>
  );
}
*/