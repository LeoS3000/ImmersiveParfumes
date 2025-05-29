import * as THREE from 'three';

const PerfumeLiquidMaterial = shaderMaterial(
  {
    // Uniforms
    cameraPosition: new THREE.Vector3(),
    displacementFactor: 0.05, // Start with a subtle displacement
    // You can add other uniforms here if needed, e.g., time for animated effects
    // time: 0.0, 
    // liquidColor: new THREE.Color(0.4, 0.6, 0.9), // If you want to pass color as uniform
  },
  vertexShader,
  fragmentShader
);
// Extend so it can be used declaratively
extend({ PerfumeLiquidMaterial });
