import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three'; // Needed for THREE.LoopOnce and other THREE constants/classes
import vertex from '../shaders/liquid.vert'; // Path to your vertex shader
import fragment from '../shaders/liquid.frag'; // Path to your fragment shader
import { extend } from '@react-three/fiber';
const LiquidShaderMaterial = shaderMaterial(
  // Uniforms
  {
    // Vertex Shader Uniforms
    wobble: new THREE.Vector2(3, 3), // Default wobble

    liquid_height: 0.5, // Example value, adjust as needed
    liquid_surface_color: new THREE.Vector4(1.0, 1.0, 1.0, 1.0), // Example: blueish liquid
    liquid_rim_gradient: null, // This will be a texture
    rim_emission_intensity: 1.5,
    rim_exponent: 3.0,
    emission_intensity: 0.1,
    liquid_surface_gradient_size: 0.1,
  },
  vertex,
  fragment
);

// Extend the material to make it available as a JSX component
extend({ LiquidShaderMaterial });

export { LiquidShaderMaterial };