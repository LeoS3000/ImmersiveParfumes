// src/hooks/useCameraFocus.js
import { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";

const DEFAULT_CAMERA_POSITION = [0, 0, 10];
const DEFAULT_LOOKAT_TARGET = [0, 0, 0];

export const useCameraFocus = (activeTargetName, controlsRef) => {
  const { scene } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;

    if (activeTargetName) {
      const targetPosition = new THREE.Vector3();
      const activeObject = scene.getObjectByName(activeTargetName);

      if (activeObject) {
        activeObject.getWorldPosition(targetPosition);
        controlsRef.current.setLookAt(
          0,
          0, // Slightly above the target's center
          5, // Closer to the target
          targetPosition.x,
          targetPosition.y,
          targetPosition.z,
          true // Enable smooth transition
        );
      }
    } else {
      controlsRef.current.setLookAt(
        ...DEFAULT_CAMERA_POSITION,
        ...DEFAULT_LOOKAT_TARGET,
        true // Enable smooth transition
      );
    }
  }, [activeTargetName, scene, controlsRef]);
};