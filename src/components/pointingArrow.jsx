import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function PointingArrow({ start, end, color = 'yellow', lineWidth = 2, headLength = 0.2, headWidth = 0.15 }) {
    const groupRef = useRef();
    const headRef = useRef();

    // Calculate the direction and length for the arrow
    const direction = new THREE.Vector3().subVectors(new THREE.Vector3(...end), new THREE.Vector3(...start));
    const length = direction.length();
    direction.normalize();

    // Points for the Line component (shaft)
    // We shorten the line slightly so the head doesn't overlap too much or start inside the target
    const lineEndOffset = direction.clone().multiplyScalar(length - headLength * 0.8);
    const linePoints = [
        new THREE.Vector3(...start),
        new THREE.Vector3(...start).add(lineEndOffset)
    ];

    // Position and orient the arrowhead
    // The cone's origin is at its base center. We want its tip to be at 'end'.
    const headPosition = new THREE.Vector3(...start).add(direction.clone().multiplyScalar(length - headLength / 2));


    useFrame(() => {
        // Orient the arrowhead to point in the direction of the arrow
        if (headRef.current) {
            headRef.current.lookAt(new THREE.Vector3(...end));
            // ConeGeometry points along its Y-axis by default.
            // If lookAt doesn't align it as expected, you might need an additional rotation.
            // For example, if the cone points "up" initially:
            headRef.current.rotateX(Math.PI / 2);
        }
    });


    return (
        <group ref={groupRef}>
            <Line
                points={linePoints}
                color={color}
                lineWidth={lineWidth}
            />
            <mesh ref={headRef} position={headPosition}>
                <coneGeometry args={[headWidth, headLength, 8]} /> {/* radius, height, segments */}
                <meshBasicMaterial color={color} />
            </mesh>
        </group>
    );
}

export default PointingArrow;