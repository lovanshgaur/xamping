import { LEVEL_STEP } from "@/constants/limits";

/** @param {number} xp */
export function levelFromXP(xp) {
  const safe = Math.max(0, xp | 0);
  return Math.floor(safe / LEVEL_STEP) + 1;
}

/** XP required to reach the next level from `xp`. */
export function xpToNextLevel(xp) {
  const nextThreshold = levelFromXP(xp) * LEVEL_STEP;
  return Math.max(0, nextThreshold - xp);
}

/** Progress 0..1 through the current level. */
export function levelProgress(xp) {
  const inLevel = xp % LEVEL_STEP;
  return inLevel / LEVEL_STEP;
}
