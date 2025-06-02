import React from "react";
import { a, useSpring } from "@react-spring/three";
import {Flowers} from "./flowers"; // ← your existing Flowers component

export function AnimatedFlowers({ trigger }) {
  // When trigger=true, flowersY→0; when false, flowersY→-5 (off-screen)
  const { flowersY } = useSpring({
    flowersY: trigger ? 2 : -10,
    config: { tension: 200, friction: 20 },
  });

  return (
    // a.group makes this group “animatable” by react-spring/three
    <a.group position-y={flowersY}>
      <Flowers />
    </a.group>
  );
}