import { useTransform } from 'framer-motion';

/**
 * Custom hook to generate animated position and rotation values based on mouse input.
 * @param {Object} params
 * @param {{x: any, y: any}} params.mouse - Mouse motion values (framer-motion motion values)
 * @param {Array} params.position - [x, y, z] base position
 * @param {Array} params.rotation - [x, y, z] base rotation
 * @param {number} params.multiplier - Animation strength
 * @returns {Object} Animated values: { positionX, positionY, rotationX, rotationY }
 */
export function useMouseMotionTransform({ mouse, position, rotation, multiplier = 1.4 }) {
    // Defaults
    const pos = position || [0, 0, 0];
    const rot = rotation || [0, 0, 0];
    let rotationX = rot[0], rotationY = rot[1], positionX = pos[0], positionY = pos[1];

    if (mouse) {
        const a = multiplier / 2;
        rotationX = useTransform(mouse.x, [0, 1], [rot[0] - a, rot[0] + a]);
        rotationY = useTransform(mouse.y, [0, 1], [rot[1] - a, rot[1] + a]);
        positionX = useTransform(mouse.x, [0, 1], [pos[0] - multiplier * 2, pos[0] + multiplier * 2]);
        positionY = useTransform(mouse.y, [0, 1], [pos[1] + multiplier * 2, pos[1] - multiplier * 2]);
    }

    return { positionX, positionY, rotationX, rotationY };
}
