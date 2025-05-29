
/**
 * Fades in an audio element.
 * @param {THREE.Audio} audio - The THREE.Audio object.
 * @param {number} [duration=500] - Fade duration in milliseconds.
 * @param {number} [targetVolume=0.5] - The target volume (0 to 1).
 */
export function fadeIn(audio, duration = 500, targetVolume = 0.5) {
  if (!audio) return;
  const start = performance.now();
  const initialVolume = 0;
  audio.setVolume(initialVolume);
  if (!audio.isPlaying) {
    audio.play();
  }

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    audio.setVolume(initialVolume + (targetVolume - initialVolume) * progress);
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }
  requestAnimationFrame(animate);
}

/**
 * Fades out an audio element.
 * @param {THREE.Audio} audio - The THREE.Audio object.
 * @param {number} [duration=500] - Fade duration in milliseconds.
 */
export function fadeOut(audio, duration = 500) {
  if (!audio || !audio.isPlaying) return;
  const start = performance.now();
  const initialVolume = audio.getVolume();

  function animate(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    audio.setVolume(initialVolume * (1 - progress));
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      audio.stop();
      audio.setVolume(initialVolume); // Reset volume for next play
    }
  }
  requestAnimationFrame(animate);
}