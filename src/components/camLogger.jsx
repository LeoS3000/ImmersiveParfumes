import { useThree, useFrame } from "@react-three/fiber";

export function CameraLogger() {
    const { camera } = useThree();

    useFrame(() => {
        // Log the camera's position on every frame
        // You might want to log less frequently if it clutters the console
        console.log("Camera Position:", camera.position.x, camera.position.y, camera.position.z);
    });

    return null; // This component doesn't render anything visually
}

// Then, inside your <Canvas> component in App:
// <Canvas ...>
//   <CameraLogger /> {/* Add this component inside your Canvas */}
//   {/* ... rest of your scene ... */}
// </Canvas>