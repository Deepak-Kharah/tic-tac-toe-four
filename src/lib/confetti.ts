import confetti from "canvas-confetti";

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
  if (isRunning) {
    return;
  }

  isRunning = true;

  // Safety net: force-release the running flag if confetti never resolves.
  const safetyTimeout = setTimeout(() => {
    resetConfetti();
  }, 5000);

  try {
    const celebrationDefaults: confetti.Options = {
      particleCount: 250,
      startVelocity: 45,
      drift: 0.4,
      spread: 100,
      ticks: 320,
      gravity: 0.8,
      scalar: 1.2,
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

    await Promise.all([
      confetti({
        ...celebrationDefaults,
        origin: { x: 0.22, y: 0.7 },
        angle: 60,
      }),
      confetti({
        ...celebrationDefaults,
        origin: { x: 0.78, y: 0.7 },
        angle: 120,
      }),
    ]);

    currentTimeout = setTimeout(() => {
      isRunning = false;
      currentTimeout = null;
      clearTimeout(safetyTimeout);
    }, 3000);
  } catch (error) {
    clearTimeout(safetyTimeout);
    resetConfetti();
    throw error;
  }
}
