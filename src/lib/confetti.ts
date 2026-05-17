import confetti from "canvas-confetti";

// Track running state to prevent overlapping confetti bursts
let isRunning = false;
let currentTimeout: NodeJS.Timeout | null = null;

export function resetConfetti() {
  isRunning = false;
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }
}

export async function launchFirework() {
  // Prevent overlapping calls
  if (isRunning) {
    return;
  }

  isRunning = true;

  // Safety timeout to ensure flag is always reset (backup in case something goes wrong)
  const safetyTimeout = setTimeout(() => {
    resetConfetti();
  }, 5000); // 5 seconds safety net

  try {
    // Dual-cannon confetti configuration
    const celebrationDefaults: confetti.Options = {
      particleCount: 250,

      startVelocity: 45, // Higher velocity for more dramatic effect
      drift: 0.4,
      spread: 100, // Narrower spread for directional cannons (was 200)
      ticks: 320, // Longer duration for more dramatic fall
      gravity: 0.8, // Slightly reduced gravity for slower fall
      scalar: 1.2, // Larger particles for more visual impact
      zIndex: 100,
      colors: [
        "#c0d1ff",
        "#6b69ff",
        "#1419ff",
        "#7b15c7",
        "#ff6b9d",
        "#ffd93d",
      ],
      disableForReducedMotion: true,
    };

    // Dual cannons from left and right sides, aimed upward and inward
    await Promise.all([
      confetti({
        ...celebrationDefaults,
        origin: { x: 0.22, y: 0.7 }, // Left side
        angle: 60, // Up and toward center
      }),
      confetti({
        ...celebrationDefaults,
        origin: { x: 0.78, y: 0.7 }, // Right side
        angle: 120, // Up and toward center
      }),
    ]);

    // Reset running flag after animation completes
    currentTimeout = setTimeout(() => {
      isRunning = false;
      currentTimeout = null;
      clearTimeout(safetyTimeout); // Clear safety timeout since we completed normally
    }, 3000); // Longer timeout to match the longer animation
  } catch (error) {
    // Reset flag on error to prevent permanent lock
    clearTimeout(safetyTimeout);
    resetConfetti();
    throw error;
  }
}
