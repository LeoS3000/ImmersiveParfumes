import { useState, useRef, useEffect, useCallback } from "react";

// --- Static Picture Overlay Component with Hold-to-Start ---
export function StaticOverlay({ onStart }) {
    // State to track the progress bar's completion (0-100)
    const [progress, setProgress] = useState(0);
    // State to track if the user is currently holding the mouse button
    const [isHolding, setIsHolding] = useState(false);
    // Ref to manage the animation frame, allowing us to cancel it
    const animationFrameRef = useRef();
    // Ref to track the start time of the hold
    const startTimeRef = useRef();

    // The total time required to hold in milliseconds
    const HOLD_DURATION = 1000; // 1.5 seconds

    // This function is called on every frame while the user is holding the mouse down.
    // It calculates the elapsed time and updates the progress bar.
    const animateProgress = useCallback(() => {
        const elapsedTime = Date.now() - startTimeRef.current;
        const currentProgress = Math.min((elapsedTime / HOLD_DURATION) * 100, 100);
        setProgress(currentProgress);

        if (currentProgress < 100) {
            // If not yet complete, request another animation frame
            animationFrameRef.current = requestAnimationFrame(animateProgress);
        } else {
            // If complete, call the onStart function to begin the experience
            onStart();
        }
    }, [onStart]);

    // This effect hook manages the starting and stopping of the progress animation
    // based on the `isHolding` state.
    useEffect(() => {
        if (isHolding) {
            // When holding starts, record the start time and begin the animation
            startTimeRef.current = Date.now();
            animationFrameRef.current = requestAnimationFrame(animateProgress);
        } else {
            // When holding stops (mouse up or leave), cancel any pending animation
            // and reset the progress bar to zero.
            cancelAnimationFrame(animationFrameRef.current);
            setProgress(0);
        }

        // Cleanup function: ensures the animation is cancelled if the component unmounts
        return () => cancelAnimationFrame(animationFrameRef.current);
    }, [isHolding, animateProgress]);


    // --- Event Handlers ---
    const handleMouseDown = () => setIsHolding(true);
    const handleMouseUp = () => setIsHolding(false);
    const handleMouseLeave = () => setIsHolding(false); // Also stop if cursor leaves the screen

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column', // Align items vertically
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 1000,
                backgroundImage: 'url(/textures/start.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: 'white',
                // Prevents text selection while holding the click
                userSelect: 'none',
            }}
            // Assign event handlers to the main div
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            {/* --- Informational Text --- */}
            <div style={{
                padding: '10px 20px',
                borderRadius: '8px',
                marginBottom: '20px'
            }}>
                <p style={{ margin: 0, fontSize: '1.2em', fontWeight: 'bold', fontFamily: 'Arial, serif' }}>
                    Click and Hold to Enter
                </p>
            </div>

            {/* --- Progress Bar Container --- */}
            <div style={{
                width: '50%',
                maxWidth: '400px',
                height: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '5px',
                overflow: 'hidden', // Ensures the inner bar stays within the rounded corners
            }}>
                {/* --- Progress Bar Fill --- */}
                <div style={{
                    width: `${progress}%`, // Width is dynamically set by the progress state
                    height: '100%',
                    backgroundColor: 'white',
                    borderRadius: '5px',
                    // Smooth transition for a nicer visual effect
                    transition: 'width 0.1s linear',
                }} />
            </div>
        </div>
    );
}