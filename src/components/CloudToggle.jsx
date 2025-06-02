import { useState, useCallback } from "react";
import { motion } from "framer-motion-3d";

export function CloudToggle({ onToggle }) {
  /**
   * onToggle: () => void
   *   Parent‐provided callback that hides/fades out the clouds.
   *
   * This component:
   *   1) Renders a large, fully transparent <motion.mesh> that catches clicks.
   *   2) When clicked, it calls onToggle() and sets internal clicked=true.
   *   3) Once clicked, it returns null (i.e. unmounts itself) so no further clicks are possible.
   */

  const [clicked, setClicked] = useState(false);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (!clicked) {
        onToggle();
        setClicked(true);
      }
    },
    [clicked, onToggle]
  );

  if (clicked) {
    return null;
  }

  return (
    <motion.mesh
      visible={false}
      onClick={handleClick}
      // Position/scale so it covers most of your scene.
      position={[0, 0, 0]}
      scale={[200, 200, 200]}
      geometry={<boxGeometry args={[1, 1, 1]} />}
      material={<meshBasicMaterial transparent opacity={0} />}
      // (Optional subtle hover feedback, can be removed if undesired)
      whileHover={{ scale: [210, 210, 210] }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    />
  );
}