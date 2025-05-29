precision mediump float;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);
  float dist = length(uv);
  float alpha = smoothstep(0.2, 0.0, dist); // weicher Kern

  vec3 baseColor = vec3(0.2, 0.2, 0.9); // A good base blue

  // Add a shimmering effect that brightens towards the center (or based on dist)
  // You can play with the second vec3 and the mix factor
  vec3 shimmerColor = mix(baseColor, vec3(0.5, 0.6, 0.9), 1.0 - dist * 2.0); // Brighter in the center

  vec3 finalColor = mix(baseColor, shimmerColor, smoothstep(0.0, 0.5, dist)); // Blend the shimmer
  

  gl_FragColor = vec4(baseColor, alpha * 0.6);
}