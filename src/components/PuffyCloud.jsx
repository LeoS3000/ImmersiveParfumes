import * as THREE from "three";
import { createContext, useContext, useRef, useState, useEffect } from "react"; // Import useEffect
import { useFrame } from "@react-three/fiber";
import { Cloud } from "@react-three/drei";
import { BallCollider, RigidBody } from "@react-three/rapier";

const context = createContext();

export function Puffycloud({ seed, vec = new THREE.Vector3(), onCloudRisen, ...props }) { // Add onCloudRisen prop
  const api = useRef();
  const rig = useContext(context);
  const [hasRisen, setHasRisen] = useState(false);
  const [colliderAdded, setColliderAdded] = useState(false);
  const [cloudPosition, setCloudPosition] = useState(props.position ?? [0, 0, 0]);

  // Use useEffect to trigger the callback when hasRisen changes to true
  useEffect(() => {
    if (hasRisen && onCloudRisen) {
      onCloudRisen();
    }
  }, [hasRisen, onCloudRisen]);

  const contact = (payload) => {
    if (
      payload.other.rigidBodyObject?.userData?.cloud &&
      payload.totalForceMagnitude / 1000 > 300 &&
      !hasRisen
    ) {
      setHasRisen(true);
    }
  };

  useFrame(() => {
    api.current?.applyImpulse(
      vec.copy(api.current.translation()).negate().multiplyScalar(10)
    );
    if (hasRisen && api.current && !colliderAdded) {
      const position = api.current.translation();
      setCloudPosition([position.x, position.y, position.z]);

      api.current.applyImpulse({ x: 0, y: 30, z: 0 }, true);
      api.current.setGravityScale(0);
      api.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
      api.current.setAngvel({ x: 0, y: 0, z: 0 }, true);

      setColliderAdded(true);
    }
  });

  return (
    <>
      <RigidBody
        ref={api}
        userData={{ cloud: true }}
        onContactForce={contact}
        linearDamping={4}
        angularDamping={1}
        friction={0.1}
        type="dynamic"
        {...props}
        colliders={false}
      >
        <BallCollider args={[4]} />
        {hasRisen && (
          <>
            {/* Physics collider */}
            <BallCollider args={[10]} position={[0, 5, 0]} />
          </>
        )}
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
      </RigidBody>

      {/* Separate RigidBody barrier to block other clouds */}
      {hasRisen && (
        <>
          <RigidBody type="fixed" position={[cloudPosition[0], cloudPosition[1] + 5, cloudPosition[2]]}>
            <BallCollider args={[10]} />
          </RigidBody>
        </>
      )}
    </>
  );
}