
import { useEffect, useState } from "react";
import { showStreakConfetti } from "@/lib/confetti";

export function useStreakCelebration(
  currentStreak: number | undefined,
  previousStreak: number | undefined
) {
  const [hasCelebrated, setHasCelebrated] = useState(false);

  useEffect(() => {
    // Check if we have both a valid current streak and a previous streak to compare
    if (
      currentStreak !== undefined &&
      previousStreak !== undefined &&
      currentStreak > previousStreak &&
      !hasCelebrated
    ) {
      // Trigger confetti for streak increases
      showStreakConfetti(currentStreak);
      setHasCelebrated(true);
    } else if (currentStreak !== previousStreak) {
      // Reset the celebration flag when the streak changes
      setHasCelebrated(false);
    }
  }, [currentStreak, previousStreak, hasCelebrated]);

  return null; // This hook doesn't return any UI
}

export default useStreakCelebration;
