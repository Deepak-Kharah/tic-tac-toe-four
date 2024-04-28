import { confetti, ConfettiOptions } from "@tsparticles/confetti";

export function launchFirework() {
  const duration = 15 * 100,
    animationEnd = Date.now() + duration,
    defaults: ConfettiOptions = {
      gravity: 10,
      startVelocity: 20,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors: ["c0d1ff", "6b69ff", "1419ff", "7b15c7"],
    };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: NodeJS.Timeout = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 10 * (timeLeft / duration);

    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  }, 250);
}
