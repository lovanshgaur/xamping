import { DEFAULT_XP, DIFFICULTY_MULTIPLIER } from "@/constants/limits";

/**
 * XP awarded for completing a task. Falls back to difficulty-based math when
 * the task carries no explicit XP.
 * @param {import("../schema").Task} task
 */
export function awardForTask(task) {
  if (typeof task.xp === "number" && task.xp > 0) return Math.round(task.xp);
  const diff = task.difficulty ?? "medium";
  const mult = DIFFICULTY_MULTIPLIER[diff] ?? 1;
  return Math.round(DEFAULT_XP.task * mult);
}

/** XP awarded when a project ships. */
export function awardForProject() {
  return DEFAULT_XP.project;
}

/** XP awarded for submitting an application. */
export function awardForApplication() {
  return DEFAULT_XP.application;
}

/** XP awarded for consistency (unbroken streak day). */
export function consistencyBonus() {
  return DEFAULT_XP.consistencyBonus;
}

/** XP awarded when a full week is completed. */
export function weeklyCompletionBonus() {
  return DEFAULT_XP.weeklyCompletionBonus;
}
