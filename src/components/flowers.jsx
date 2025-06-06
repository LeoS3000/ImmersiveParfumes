/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/models/flowers.glb -o src/components/flowers.jsx -r public 
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Flowers(props) {
  const { nodes, materials } = useGLTF('/models/flowers.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[-5.302, 0.6, -0.387]} rotation={[-0.091, 0.282, 0.791]} scale={0.012}>
        <group position={[-1.145, 19.793, -0.459]}>
          <group position={[1.078, -0.326, -1.36]} rotation={[Math.PI, 0.856, 0]} scale={[-0.918, -1.054, -0.918]}>
            <mesh geometry={nodes.Capsule006.geometry} material={materials['01 - Defaultывва']} position={[-1.041, 14.33, 0]} rotation={[0, 0, 0.101]} scale={0.812} />
            <mesh geometry={nodes.Line006.geometry} material={materials['01 - Default0-']} position={[-1.879, 2.056, -0.051]} rotation={[Math.PI / 2, -0.136, 0]} />
          </group>
          <group position={[-0.692, 0.566, 1.344]} rotation={[0, 0, 0.101]}>
            <mesh geometry={nodes.Capsule004.geometry} material={materials['01 - Defaultывва']} position={[1.768, 16.127, -1.393]} rotation={[0, 0, 0.101]} scale={[0.745, 0.855, 0.745]} />
            <mesh geometry={nodes.Line007.geometry} material={materials['01 - Default0-']} position={[0.843, 2.216, -1.097]} rotation={[1.392, -0.168, 2.192]} scale={[0.918, 0.918, 1.054]} />
          </group>
          <group position={[3.02, -0.122, 1.22]}>
            <mesh geometry={nodes.Capsule005.geometry} material={materials['01 - Defaultывва']} position={[-1.469, 14.824, 1.417]} rotation={[-0.052, 0.93, -0.047]} scale={[0.918, 1.054, 0.918]} />
            <mesh geometry={nodes.Line005.geometry} material={materials['01 - Default0-']} position={[-0.737, 1.594, 0.951]} rotation={[1.749, 0.168, -0.95]} scale={[0.918, 0.918, 1.054]} />
          </group>
        </group>
        <group position={[4.135, -23.88, 0.427]} rotation={[Math.PI / 2, 0, 0]} scale={0.907}>
          <mesh geometry={nodes.Loft003001_1.geometry} material={materials['09 - Default']} />
          <mesh geometry={nodes.Loft003001_2.geometry} material={materials['09 - Default']} />
        </group>
        <group position={[2.662, 32.652, 8.846]} rotation={[-Math.PI, 0, -Math.PI]} scale={-1}>
          <mesh geometry={nodes.Sphere001_1.geometry} material={materials['01 - Default']} />
          <mesh geometry={nodes.Sphere001_2.geometry} material={materials['01 - Default']} />
        </group>
        <group position={[8.38, 32.652, -2.939]} rotation={[Math.PI, 1.085, 0]}>
          <mesh geometry={nodes.Sphere002_1.geometry} material={materials['01 - Default']} />
          <mesh geometry={nodes.Sphere002_2.geometry} material={materials['01 - Default']} />
        </group>
        <group position={[-5.861, 32.652, -2.939]} rotation={[0, 1.034, 0]} scale={-1}>
          <mesh geometry={nodes.Sphere003_1.geometry} material={materials['01 - Default']} />
          <mesh geometry={nodes.Sphere003_2.geometry} material={materials['01 - Default']} />
        </group>
        <group position={[8.991, 22.955, 2.889]} rotation={[0, 1.295, Math.PI]} scale={[1, 0.787, 1]}>
          <mesh geometry={nodes.Sphere007_1.geometry} material={materials['01 - Defaultыв']} />
          <mesh geometry={nodes.Sphere007_2.geometry} material={materials['01 - Defaultыв']} />
        </group>
        <group position={[-1.309, 22.954, -6.945]} rotation={[0, 0.272, 0]} scale={[-1, -0.787, -1]}>
          <mesh geometry={nodes.Sphere008_1.geometry} material={materials['01 - Defaultыв']} />
          <mesh geometry={nodes.Sphere008_2.geometry} material={materials['01 - Defaultыв']} />
        </group>
        <group position={[-3.282, 22.955, 7.465]} rotation={[-Math.PI, 0.762, -Math.PI]} scale={[-1, -0.787, -1]}>
          <mesh geometry={nodes.Sphere009_1.geometry} material={materials['01 - Defaultыв']} />
          <mesh geometry={nodes.Sphere009_2.geometry} material={materials['01 - Defaultыв']} />
        </group>
        <mesh geometry={nodes.Sphere014.geometry} material={materials['01 - Default0-ва']} position={[2.044, -3.046, 0.366]} scale={[1, 0.569, 1]} />
      </group>
      <mesh geometry={nodes.Cylinder082.geometry} material={materials['Material #29']} position={[-5.542, 0.364, -0.443]} rotation={[0.851, -1.026, 1.42]} scale={[-0.007, -0.007, -0.004]} />
      <mesh geometry={nodes.Cylinder083.geometry} material={materials['Material #29']} position={[-5.134, 0.061, -0.103]} rotation={[2.718, -1.127, 1.447]} scale={[-0.009, -0.007, -0.005]} />
      <mesh geometry={nodes.Sphere125001.geometry} material={materials['5енук']} position={[-5.73, 0.396, 0.066]} rotation={[0.975, 0.031, -2.548]} scale={[-0.008, -0.025, -0.01]} />
      <mesh geometry={nodes.Line012.geometry} material={materials['Material #29']} position={[-4.267, -0.18, -0.747]} rotation={[0.505, -1.422, -1.95]} scale={[-0.009, -0.01, -0.007]} />
      <mesh geometry={nodes.Sphere124001.geometry} material={materials['5ен']} position={[-6.052, 0.381, -0.391]} rotation={[0.865, -0.072, -1.661]} scale={[-0.009, -0.022, -0.009]} />
    </group>
  )
}

useGLTF.preload('/models/flowers.glb')
