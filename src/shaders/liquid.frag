// Fragment Shader

// Custom uniforms from your Godot shader
uniform float liquid_height;                // Max height of the liquid
uniform vec4 liquid_surface_color;         // Color of the liquid surface (r,g,b,a)
uniform sampler2D liquid_rim_gradient;      // Texture for the rim gradient
uniform float rim_emission_intensity;       // Intensity of emission at the rim
uniform float rim_exponent;                 // Exponent for the Fresnel/rim effect
uniform float emission_intensity;           // Base emission intensity
uniform float liquid_surface_gradient_size; // Size of the gradient at the liquid surface

// Varyings received from the vertex shader
varying float vYcoordinate;
varying vec3 vViewPosition;
varying vec3 vViewNormal;
varying vec2 vUv;

void main() {
    // Fresnel-like rim calculation
    // This is based on the angle between the view direction and the surface normal
    vec3 normal_view_normalized = normalize(vViewNormal);
    vec3 view_dir_normalized = normalize(-vViewPosition); // Vector from surface point to camera (camera is at origin in view space)
    
    float fresnel_dot = dot(normal_view_normalized, view_dir_normalized);
    // The original Godot shader's Fresnel logic:
    // fresnel = abs(fresnel_dot_product); fresnel = 1.0 - fresnel;
    // This is equivalent to 1.0 - abs(fresnel_dot_product)
    float fresnel = 1.0 - abs(fresnel_dot); 
    float pow_fresnel = pow(fresnel, rim_exponent);

    // Discard pixels above the liquid_height
    if (vYcoordinate > liquid_height) {
        discard;
    }

    vec3 final_albedo;
    // Use the alpha from the main liquid_surface_color by default.
    // You could also mix alphas if liquid_rim_gradient has varying alpha.
    float final_alpha = liquid_surface_color.a; 

    if (gl_FrontFacing) {
        // Front-facing polygons (the liquid's visible surface)

        // Sample the rim gradient texture.
        // The original Godot shader used `vec2(pow_fresnel)` for a sampler2D.
        // This typically means the texture is used as a 1D lookup.
        // We sample along the U-axis using pow_fresnel, and V can be fixed (e.g., 0.5 for the middle).
        vec4 liquid_color_from_gradient = texture2D(liquid_rim_gradient, vec2(pow_fresnel, 0.5));

        // Calculate the surface component for mixing liquid color and surface color
        float surface_component = smoothstep(
            liquid_height - liquid_surface_gradient_size, // Start of the gradient
            liquid_height,                                // End of the gradient (full surface color)
            vYcoordinate                                  // Current pixel's Y coordinate
        );

        // Mix the gradient color (deeper liquid) with the surface color
        final_albedo = mix(liquid_color_from_gradient.rgb, liquid_surface_color.rgb, surface_component);
        
        // If your liquid_rim_gradient texture contains alpha, you might want to mix it too:
        // final_alpha = mix(liquid_color_from_gradient.a, liquid_surface_color.a, surface_component);

    } else {
        // Back-facing polygons (underside of the liquid surface)
        // The Godot shader sets ALBEDO to liquid_surface_color.rgb and makes it unaffected by AO.
        // The NORMAL modification in Godot was for its internal pipeline; here we set color directly.
        // The pow_fresnel (calculated earlier using the geometry's actual normal) is still used for emission.
        final_albedo = liquid_surface_color.rgb;
    }

    // Calculate emission: combines base emission and rim emission
    // The emission is based on the calculated albedo for the respective face (front or back)
    vec3 calculated_emission = final_albedo * (pow_fresnel * rim_emission_intensity + emission_intensity);

    // Final color is albedo + emission
    gl_FragColor = vec4(final_albedo + calculated_emission, final_alpha);
}
