import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export function Meadow(props) {
  const { nodes, materials: loadedMaterials } = useGLTF('/models/meadow.glb');

  // It's good practice to use useMemo for creating materials so they are not
  // recreated on every render, unless the original loadedMaterials change.
  const customMaterials = useMemo(() => {
    // --- Material for the Outer Glass Surface ---
    // We'll create a new MeshPhysicalMaterial for it.
    // We try to retain the original color if it was set in the GLTF.
    const outerGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: loadedMaterials['glass outside '] ? loadedMaterials['glass outside '].color : new THREE.Color(0xccddff), // Light blue tint if no original color
      roughness: 0.05,    // Low roughness for smooth, shiny glass
      metalness: 0.0,     // Glass is not metallic
      transmission: 0.95, // This is key for transparency. 0 is opaque, 1 is fully transparent/transmissive.
      ior: 1.5,           // Index of Refraction for glass (common values: 1.45-1.55)
      transparent: true,  // Crucial: Tells Three.js to handle this material as transparent
      // thickness: 0.2,  // Optional: Give a sense of thickness for refraction. Requires `transmission` > 0.
                           // You might need a thicknessMap or experiment with this value.
      // side: THREE.DoubleSide, // Optional: Render both sides. Useful if your model's glass is a single plane.
                                // For a "solid" bottle with inner and outer surfaces, FrontSide (default) is usually fine.
      // depthWrite: false, // Optional: Can help with rendering order issues with multiple transparent objects. Test carefully.
    });

    // --- Material for the Inner Glass Surface or Liquid ---
    // If 'glass oinside' represents the liquid, you might want different properties (e.g., ior for water is ~1.33)
    // If it's an inner layer of glass, similar properties to outerGlassMaterial might apply.
    const innerMaterial = new THREE.MeshPhysicalMaterial({
      color: loadedMaterials['glass oinside'] ? loadedMaterials['glass oinside'].color : new THREE.Color(0xffeecc), // Light amber/yellow tint for liquid, or another glass tint
      roughness: 0.1,
      metalness: 0.0,
      transmission: 0.9, // Slightly less or different transmission for effect
      ior: 1.33,         // Example: Index of Refraction for water/perfume liquid
      transparent: true,
      // thickness: 0.1,
      // depthWrite: false,
    });

    return {
      outerGlass: outerGlassMaterial,
      inner: innerMaterial,
      // Keep other materials as they are
      capAndNozzle: loadedMaterials['Material.006'], // Assuming this is for the cap
      nozzleTop: loadedMaterials['Material.001'],   // Assuming this is for the atomizer
      label: loadedMaterials.label,
    };
  }, [loadedMaterials]); // This dependency array ensures materials are recreated if the model is reloaded/changed.

  return (
    <group {...props} dispose={null}>
      <group position={[-0.098, 4.713, 0]} scale={[2.028, 3.386, 2.028]}>
        {/* Assign the new transparent material to the outer glass mesh */}
        <mesh geometry={nodes.Cylinder.geometry} material={customMaterials.outerGlass} />
        {/* Assign the new transparent material to the inner glass/liquid mesh */}
        <mesh geometry={nodes.Cylinder_1.geometry} material={customMaterials.inner} />
        {/* These seem to be cap parts, keep their original material */}
        <mesh geometry={nodes.Cylinder_2.geometry} material={customMaterials.capAndNozzle} />
        <mesh geometry={nodes.Cylinder_3.geometry} material={customMaterials.capAndNozzle} />
      </group>
      {/* This seems to be the atomizer/opening, keep its original material */}
      <mesh geometry={nodes.ouverture.geometry} material={customMaterials.nozzleTop} position={[1.294, 12.109, -0.71]} scale={[1.217, 1.317, 1.289]} />
      <group position={[-0.098, 4.713, 0]} scale={[2.028, 3.386, 2.028]}>
        {/* This mesh also uses 'glass oinside', so it will also get the transparent inner material.
            This could be the perfume liquid itself. */}
        <mesh geometry={nodes.Cylinder004.geometry} material={customMaterials.inner} />
        {/* The label should remain opaque */}
        <mesh geometry={nodes.Cylinder004_1.geometry} material={customMaterials.label} />
      </group>
    </group>
  );
}

useGLTF.preload('/models/meadow.glb');