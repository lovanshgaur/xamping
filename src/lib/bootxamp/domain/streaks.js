import { daysBetween } from "@/utils/dates";

/**
 * Compute the current overall streak (consecutive dates with any
 * completed task) from the submitted days in the data.
 * @param {import("../schema").BootXampData} data
 * @returns {{ current: number, longest: number }}
 */
export function computeOverallStreak(data) {
  const dates = collectCompletedDates(data);
  return computeStreakFromDates(dates);
}

/**
 * Compute a per-category streak by filtering tasks whose department slug
 * matches (or by predicate for compound categories).
 * @param {import("../schema").BootXampData} data
 * @param {(task: import("../schema").Task) => boolean} predicate
 */
export function computeStreakBy(data, predicate) {
  const dates = new Set();
  for (const w of data.weeks) {
    for (const d of w.days) {
      for (const dept of d.departments) {
        for (const t of dept.tasks) {
          if (t.completed && predicate(t)) dates.add(d.date);
        }
      }
    }
  }
  return computeStreakFromDates(Array.from(dates).sort());
}

/** @param {import("../schema").BootXampData} data */
function collectCompletedDates(data) {
  const dates = new Set();
  for (const w of data.weeks) {
    for (const d of w.days) {
      const anyDone = d.departments.some((dept) => dept.tasks.some((t) => t.completed));
      if (anyDone) dates.add(d.date);
    }
  }
  return Array.from(dates).sort();
}

/** @param {string[]} sortedIsoDates */
function computeStreakFromDates(sortedIsoDates) {
  if (sortedIsoDates.length === 0) return { current: 0, longest: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < sortedIsoDates.length; i += 1) {
    const gap = daysBetween(sortedIsoDates[i - 1], sortedIsoDates[i]);
    if (gap === 1) {
      run += 1;
      if (run > longest) longest = run;
    } else if (gap > 1) {
      run = 1;
    }
  }

  const last = sortedIsoDates[sortedIsoDates.length - 1];
  const gapToToday = daysBetween(last, new Date().toISOString().slice(0, 10));
  const current = gapToToday <= 1 ? run : 0;
  return { current, longest };
}
