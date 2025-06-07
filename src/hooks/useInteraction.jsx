import { useState, useMemo } from 'react';

export function useInteraction() {
    const [isInteracting, setIsInteracting] = useState(false);

    const handlers = useMemo(() => ({
        onPointerDown: (e) => {
            e.stopPropagation();
            setIsInteracting(true);
        },
        onPointerUp: (e) => {
            setIsInteracting(false);
        },
        onPointerLeave: (e) => {
            if (e.buttons) {
                setIsInteracting(false);
            }
        }
    }), []);

    return [handlers, isInteracting];
}