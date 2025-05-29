precision mediump float;

// Attributes from BufferGeometry
attribute float aRandom;      // Unique random value (0.0 to 1.0) for each particle
attribute float aStartTime;   // Global time when this particle "started" its life

// Uniforms from JavaScript
uniform float uTime;              // Current shader time
uniform vec3 uOrigin;             // Origin of the spray (e.g., tip of the perfume bottle)
uniform float uParticleLifespan;  // How long each individual particle lives
uniform float uSprayConeAngle;    // Controls the width of the spray cone (e.g., 0.0 to PI/2 - epsilon)
uniform float uInitialSpeed;      // Base initial speed of particles
uniform vec3 uGravity;            // Gravity vector (e.g., vec3(0.0, -0.5, 0.0))
uniform mat3 uRotation;


// New uniforms for enhanced realism (you'll need to add these to your shaderMaterial in JS)
uniform float uSpeedVariance;       // Variance factor for initial speed (e.g., 0.3 for +/- 30%)
uniform float uDragFactor;          // How much drag affects particles (e.g., 0.1 to 1.0). Higher = more drag.
uniform float uTurbulenceStrength;  // Strength of turbulent motion (e.g., 0.0 to 0.2)
uniform float uTurbulenceFrequency; // Frequency of turbulence changes for a particle over its life (e.g., 3.0)
uniform float uBasePointSize;       // Base size of particles in pixels (e.g., 8.0)
uniform float uPointSizeVariance;   // Variance factor for base particle size (e.g., 0.2 for +/- 20%)
uniform float uPerspectiveFactor;   // Scales point size for perspective (e.g., screen_height / 2.0 or an empirical value like 100.0-300.0)

// Varyings to pass to fragment shader
varying float vLifeRatio;   // Particle's life ratio (0.0 at birth, 1.0 at death)
varying float vRandom;      // Pass aRandom for potential use in fragment shader (e.g., color variation)

// Simple pseudo-random function (generates a vec3 in [-1,1] range)
vec3 pseudoRandomVec3(float seed1, float seed2) {
    // Simple hashing, can be replaced with more sophisticated noise if needed
    float r = fract(sin(dot(vec2(seed1, seed2), vec2(12.9898, 78.233))) * 43758.5453);
    float g = fract(sin(dot(vec2(seed1, seed2), vec2(45.1234, 92.567))) * 36541.8765);
    float b = fract(sin(dot(vec2(seed1, seed2), vec2(87.6789, 61.876))) * 24567.3456);
    return vec3(r, g, b) * 2.0 - 1.0;
}

// Helper to generate a scalar random value from a seed
float pseudoRandomScalar(float seed) {
    return fract(sin(seed * 123.456) * 789.012);
}

void main() {
    // 1. Calculate particle's age and life ratio
    float age = uTime - aStartTime;
    vLifeRatio = clamp(age / uParticleLifespan, 0.0, 1.0);
    vRandom = aRandom; // Pass to fragment shader

    // If particle is "dead" or not yet "born", hide it
    if (vLifeRatio >= 1.0 || age < 0.0) { // age < 0.0 is a safety for inactive particles
        gl_Position = vec4(10000.0, 10000.0, 10000.0, 1.0); // Move far off-screen
        gl_PointSize = 0.0;
        return;
    }

    // 2. Initial Direction (Improved Cone Distribution)
    // Use aRandom for the angle (theta)
    float angle = aRandom * 6.28318530718; // 0 to 2*PI

    // Use a second derived random number for radius distribution for better uniformity.
    // sqrt() gives a distribution where density is more uniform across the cone's circular base.
    float radiusDistributionSeed = pseudoRandomScalar(aRandom + 0.1); // Slightly offset seed
    float coneRadiusFactor = sqrt(radiusDistributionSeed);
    
    // tan(uSprayConeAngle) gives the radius of the cone base at unit distance along the cone axis.
    // Ensure uSprayConeAngle is within a safe range (e.g., 0 to < PI/2) in JS to avoid tan() issues.
    float tanConeAngle = tan(uSprayConeAngle);

    // Assuming the nozzle primarily points along its local Y-axis.
    // This direction is then transformed by modelViewMatrix.
    vec3 initialDirection = normalize(vec3(
        cos(angle) * coneRadiusFactor * tanConeAngle, // X component on the cone base disk
        1.0,                                          // Main component along the nozzle's axis
        sin(angle) * coneRadiusFactor * tanConeAngle  // Z component on the cone base disk
    ));

    // 3. Randomized Initial Speed
    float speedRandomFactor = pseudoRandomScalar(aRandom + 0.2); // Another random number
    // Vary speed e.g., if uInitialSpeed=10, uSpeedVariance=0.3, speed becomes 10 * (1.0 +/- 0.3) -> 7 to 13
    float randomizedInitialSpeed = uInitialSpeed * (1.0 + (speedRandomFactor * 2.0 - 1.0) * uSpeedVariance);

    vec3 initialVelocity = initialDirection * randomizedInitialSpeed;

    // 4. Physics of Motion & Air Resistance (Simplified)
    // Base position equation: P = P0 + V0*t + 0.5*A*t^2
    // We'll apply drag by damping the contribution of the initial velocity.
    // Damping factor increases with age, reducing the effect of initialVelocity over time.
    float dragDampening = 1.0 / (1.0 + uDragFactor * age * 0.5); // Adjust '0.5' to tune drag sensitivity

    vec3 positionFromInitialVelocity = initialVelocity * age * dragDampening;
    vec3 positionFromGravity = 0.5 * uGravity * age * age;
    
    vec3 currentPosition = positionFromInitialVelocity + positionFromGravity;

    // 5. Turbulence / Noise
    if (uTurbulenceStrength > 0.0) {
        // Turbulence evolves with particle age and uses its unique aRandom for variation.
        // vLifeRatio makes turbulence more prominent as particle disperses and loses initial momentum.
        vec3 turbulence = pseudoRandomVec3(aRandom, age * uTurbulenceFrequency) * uTurbulenceStrength * vLifeRatio;
        currentPosition += turbulence;
    }
    
    // Final position is relative to the spray origin
    currentPosition += uOrigin;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(currentPosition, 1.0);

    // 6. Point Size (with randomization, life fade, and perspective correction)
    float sizeRandomFactor = pseudoRandomScalar(aRandom + 0.3);
    float randomizedBaseSize = uBasePointSize * (1.0 + (sizeRandomFactor * 2.0 - 1.0) * uPointSizeVariance);

    // Size decreases as particle ages (e.g., evaporates or fades)
    // pow(1.0 - vLifeRatio, 2.0) gives a faster fade towards the end of life.
    float sizeDueToLife = pow(max(0.0, 1.0 - vLifeRatio), 2.0); 

    gl_PointSize = randomizedBaseSize * sizeDueToLife;
    
    // Perspective scaling: make points smaller if they are further away.
    // gl_Position.w is the distance from the camera in view space (for perspective projection).
    if (gl_Position.w > 0.001) { // Avoid division by zero or very small w
         gl_PointSize *= uPerspectiveFactor / gl_Position.w;
    } else {
        gl_PointSize = 0.0; // Hide if too close or behind camera
    }

    gl_PointSize = max(gl_PointSize, 0.1); // Ensure a minimum visible size (if desired)
}