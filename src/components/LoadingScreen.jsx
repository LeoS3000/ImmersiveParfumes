import {
    Text
} from "@react-three/drei";

export function LoadingScreen() {
  const loadingScreenStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column', // To stack text and spinner
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e', // A dark blueish background
    color: '#e0e0e0', // Light grey text
    fontFamily: '"Noto Serif", serif', // Match scene font if possible
    fontSize: '1.5em',
    zIndex: 10000, // Ensure it's on top of everything
    textAlign: 'center',
    padding: '20px',
  };

  const spinnerTextStyles = {
    marginTop: '20px',
    fontSize: '0.8em',
    color: '#b3b3b3', // Slightly darker grey
  };

  // Simple CSS spinner
  const spinnerStyles = {
    border: '8px solid #f3f3f320', // Light grey border with transparency
    borderTop: '8px solid #0077cc', // Blue for the spinning part
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    animation: 'spin 1s linear infinite',
    margin: '20px auto',
  };

  // Keyframes for the spinner animation (needs to be global or injected)
  // For simplicity, we'll rely on a <style> tag in the main HTML or this inline approach.
  // A more robust solution for React might involve styled-components or a CSS file.
  const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style> {/* Inject keyframes */}
      <div style={loadingScreenStyles}>
        <Text
            font={"/fonts/NotoSerif-Black.ttf"} // Ensure this path is correct
            fontSize={1.2} // Relative to parent's 1.5em
            color="#ffffff"
        >
            Discovering Your Scent...
        </Text>
        <div style={spinnerStyles}></div>
        <p style={spinnerTextStyles}>Please wait a moment.</p>
      </div>
    </>
  );
}