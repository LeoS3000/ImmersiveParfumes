
import * as THREE from "three"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { BallCollider, RigidBody } from "@react-three/rapier"

export function Pointer({ vec = new THREE.Vector3(), dir = new THREE.Vector3() }) {
  const ref = useRef()
  useFrame(({ pointer, viewport, camera }) => {
    vec.set(pointer.x, pointer.y, 0.5).unproject(camera)
    dir.copy(vec).sub(camera.position).normalize()
    vec.add(dir.multiplyScalar(camera.position.length()))
    ref.current?.setNextKinematicTranslation(vec)
  })
  return (
    <RigidBody userData={{ cloud: true }} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[6]} />
    </RigidBody>
  )
}