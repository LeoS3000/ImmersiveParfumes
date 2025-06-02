import { useRef, useEffect } from 'react'
import { useThree } from '@react-three/fiber'

export function Ambient() {
  const sound = useRef()
  const { camera } = useThree()

  // Finde AudioListener an der Kamera
  const listener = camera.children.find(child => child.type === 'AudioListener')

  useEffect(() => {
    if (sound.current && !sound.current.isPlaying) {
      sound.current.play()
    }
  }, [])

  if (!listener) {
    return null // Listener existiert noch nicht, nicht rendern
  }

  return (
    <positionalAudio
      ref={sound}
      args={[listener]}  // WICHTIG: listener als erstes Argument übergeben
      url="./sounds/ocean.mp3"
      loop={true}
      distance={5}
      autoplay={false}
      position={[0, 0, 0]}
    />
  )
}
