
import confetti from 'canvas-confetti';

export const showConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      particleCount: Math.floor(count * particleRatio),
      spread: 26,
      startVelocity: 55,
      ...opts,
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#4CAF50', '#8BC34A', '#CDDC39'], // Green colors
  });

  fire(0.2, {
    spread: 60,
    colors: ['#2E7D32', '#1B5E20', '#388E3C'], // Dark green
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#81C784', '#A5D6A7', '#C8E6C9'], // Light green
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#FFF9C4', '#FFEB3B', '#FFC107'], // Yellow/gold for achievements
  });
};

export const showStreakConfetti = (streak: number) => {
  // Special animation for milestone streaks
  if (streak === 7 || streak === 30 || streak === 100) {
    const duration = 5000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4CAF50', '#8BC34A', '#CDDC39'],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#2E7D32', '#1B5E20', '#388E3C'],
      });
    }, 150);
  } else {
    showConfetti();
  }
};
