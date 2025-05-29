// Vertex Shader

// Custom uniforms from your Godot shader
uniform vec2 wobble;           // For the liquid wobble effect (e.g., vec2(sin(time), cos(time)))


// Varyings to pass data to the fragment shader
varying float vYcoordinate;    // Calculated world Y-coordinate relative to object origin
varying vec3 vViewPosition;    // Vertex position in view space
varying vec3 vViewNormal;      // Vertex normal in view space
varying vec2 vUv;              // UV coordinates

// Helper function to rotate around X-axis
mat4 rotate_x(in float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat4(
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.0, c,   -s,  0.0),
        vec4(0.0, s,   c,   0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    );
}

// Helper function to rotate around Z-axis
mat4 rotate_z(in float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat4(
        vec4(c,   -s,  0.0, 0.0),
        vec4(s,   c,   0.0, 0.0),
        vec4(0.0, 0.0, 1.0, 0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    );
}

void main() {
    // Apply wobble effect to the vertex position
    // This replicates the logic from your Godot shader's vertex function
    vec3 p = position; // Using Three.js 'position' attribute
    vec3 rotated_vert_z = (rotate_z(1.6) * vec4(p, 1.0)).xyz;
    vec3 rotated_vert_x = (rotate_x(-1.6) * vec4(p, 1.0)).xyz;
    vec3 wobbled_position = (rotated_vert_z * wobble.x + rotated_vert_x * wobble.y) + p;

    // Calculate vYcoordinate: world-space Y position of the vertex,
    // relative to the object's origin's world-space Y position.
    vec4 world_pos = modelMatrix * vec4(wobbled_position, 1.0);
    vYcoordinate = world_pos.y - modelMatrix[3].y; // modelMatrix[3].y is the object's world Y origin

    // Transform position and normal to view space for fragment shader calculations
    vec4 view_pos_vec4 = modelViewMatrix * vec4(wobbled_position, 1.0);
    vViewPosition = view_pos_vec4.xyz;

    // The normal is transformed using the normalMatrix to correctly handle non-uniform scaling.
    // We assume the wobble doesn't fundamentally change the surface normal direction for this calculation,
    // similar to the original Godot shader.
    vViewNormal = normalize(normalMatrix * normal);

    // Pass UV coordinates
    vUv = uv;

    // Final vertex position in clip space
    gl_Position = projectionMatrix * view_pos_vec4;
}
