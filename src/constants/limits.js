/** Recent-activity cap for the Dashboard. */
export const RECENT_ACTIVITY_LIMIT = 10;

/** Default XP awarded when data models leave `xp` blank. */
export const DEFAULT_XP = Object.freeze({
  task: 10,
  project: 200,
  application: 25,
  reading: 15,
  exercise: 15,
  consistencyBonus: 20,
  weeklyCompletionBonus: 100,
});

/** Difficulty multipliers applied to base task XP when `task.xp` is missing. */
export const DIFFICULTY_MULTIPLIER = Object.freeze({
  easy: 1,
  medium: 1.5,
  hard: 2.25,
  epic: 3,
});

/** XP-per-department-level curve. Level = floor(xp / LEVEL_STEP) + 1. */
export const LEVEL_STEP = 100;
