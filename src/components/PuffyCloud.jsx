import * as THREE from "three";
import { createContext, useContext, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Cloud } from "@react-three/drei";
import { BallCollider, RigidBody } from "@react-three/rapier";
import { random } from "maath";

const context = createContext();

export function Puffycloud({ seed, vec = new THREE.Vector3(), ...props }) {
  const api = useRef();
  const light = useRef();
  const rig = useContext(context);
  const contact = (payload) =>
    payload.other.rigidBodyObject.userData?.cloud &&
    payload.totalForceMagnitude / 1000 > 100 &&
    flash.burst();
  useFrame((state, delta) => {
    const impulse = flash.update(state.clock.elapsedTime, delta);
    light.current.intensity = impulse * 15000;
    if (impulse === 1) rig?.current?.setIntensity(1);
    api.current?.applyImpulse(
      vec.copy(api.current.translation()).negate().multiplyScalar(10)
    );
  });
  return (
    <RigidBody
      ref={api}
      userData={{ cloud: true }}
      onContactForce={contact}
      linearDamping={4}
      angularDamping={1}
      friction={0.1}
      {...props}
      colliders={false}
    >
      <BallCollider args={[4]} />
      <Cloud
        seed={seed}
        fade={30}
        speed={0.1}
        growth={4}
        segments={40}
        volume={6}
        opacity={0.6}
        bounds={[4, 3, 1]}
      />
      <Cloud
        seed={seed + 1}
        fade={30}
        position={[0, 1, 0]}
        speed={0.5}
        growth={4}
        volume={10}
        opacity={1}
        bounds={[6, 2, 1]}
      />
      <pointLight position={[0, 0, 0.5]} ref={light} color="blue" />
    </RigidBody>
  );
}
