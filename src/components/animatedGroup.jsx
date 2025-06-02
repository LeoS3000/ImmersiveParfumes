import React, { useEffect, useState } from "react";
import { a, useSpring } from "@react-spring/three";

/**
 * AnimatedGroup slides children up/down and unmounts when hidden.
 */
export function AnimatedGroup({ active, children, fromY = -10, toY = 2 }) {
  const [shouldRender, setShouldRender] = useState(active);

  const { y } = useSpring({
    y: active ? toY : fromY,
    config: { tension: 200, friction: 20 },
    onStart: () => {
      if (active) setShouldRender(true); // Make sure it shows up
    },
    onRest: () => {
      if (!active) setShouldRender(false); // Unmount after animating out
    },
  });

  if (!shouldRender) return null;

  return <a.group position-y={y}>{children}</a.group>;
}
