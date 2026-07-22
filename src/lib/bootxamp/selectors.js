import { DEPARTMENT_IDS } from "@/constants/departments";
import { levelFromXP } from "./domain/levels";
import { getRank, getRankProgress, getNextRank } from "./domain/ranks";
import { RECENT_ACTIVITY_LIMIT } from "@/constants/limits";

/**
 * @param {import("./schema").BootXampData} data
 * @returns {import("./schema").Week | null}
 */
export function getCurrentWeek(data) {
  if (data.app.currentWeekId) {
    const w = data.weeks.find((w) => w.id === data.app.currentWeekId);
    if (w) return w;
  }
  return data.weeks[0] ?? null;
}

/**
 * @param {import("./schema").BootXampData} data
 * @returns {import("./schema").Day | null}
 */
export function getCurrentDay(data) {
  const week = getCurrentWeek(data);
  if (!week) return null;
  if (data.app.currentDayId) {
    const d = week.days.find((d) => d.id === data.app.currentDayId);
    if (d) return d;
  }
  // Prefer first non-submitted day; else last.
  const active = week.days.find((d) => !d.submitted);
  return active ?? week.days[week.days.length - 1] ?? null;
}

/** @param {import("./schema").Day | null} day */
export function getDayProgress(day) {
  if (!day) return 0;
  const tasks = day.departments.flatMap((d) => d.tasks);
  if (tasks.length === 0) return 0;
  const done = tasks.filter((t) => t.completed).length;
  return done / tasks.length;
}

/** @param {import("./schema").Day | null} day @param {import("./schema").DepartmentId} slug */
export function getDeptProgress(day, slug) {
  if (!day) return 0;
  const dept = day.departments.find((d) => d.slug === slug);
  if (!dept || dept.tasks.length === 0) return 0;
  return dept.tasks.filter((t) => t.completed).length / dept.tasks.length;
}

/** @param {import("./schema").Week | null} week */
export function getWeekProgress(week) {
  if (!week || week.days.length === 0) return 0;
  const sum = week.days.reduce((acc, d) => acc + getDayProgress(d), 0);
  return sum / week.days.length;
}

/** @param {import("./schema").Week | null} week @param {import("./schema").DepartmentId} slug */
export function getWeekDeptProgress(week, slug) {
  if (!week || week.days.length === 0) return 0;
  const perDay = week.days.map((d) => getDeptProgress(d, slug));
  const sum = perDay.reduce((a, b) => a + b, 0);
  return sum / perDay.length;
}

/** @param {import("./schema").BootXampData} data @param {import("./schema").DepartmentId} slug */
export function getDepartmentXP(data, slug) {
  let xp = 0;
  for (const w of data.weeks)
    for (const d of w.days)
      for (const dept of d.departments)
        if (dept.slug === slug) for (const t of dept.tasks) if (t.completed) xp += t.xp ?? 0;
  return xp;
}

/** @param {import("./schema").BootXampData} data @param {import("./schema").DepartmentId} slug */
export function getDepartmentLevel(data, slug) {
  return levelFromXP(getDepartmentXP(data, slug));
}

/** @param {import("./schema").BootXampData} data */
export function getAllDepartmentXP(data) {
  const out = {};
  for (const slug of DEPARTMENT_IDS) out[slug] = getDepartmentXP(data, slug);
  return out;
}

/** @param {import("./schema").BootXampData} data */
export function getOverallXP(data) {
  return data.employee.overallXP;
}

/** @param {import("./schema").BootXampData} data */
export function getOverallRank(data) {
  return getRank(data.employee.overallXP);
}

/** @param {import("./schema").BootXampData} data */
export function getOverallRankProgress(data) {
  return getRankProgress(data.employee.overallXP);
}

/** @param {import("./schema").BootXampData} data */
export function getNextRankInfo(data) {
  return getNextRank(data.employee.overallXP);
}

/**
 * @param {import("./schema").BootXampData} data
 * @param {number} [limit]
 * @returns {import("./schema").TimelineItem[]}
 */
export function getRecentTimeline(data, limit = RECENT_ACTIVITY_LIMIT) {
  const items = [...data.history.timeline];
  items.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  return items.slice(0, limit);
}

/** @param {import("./schema").BootXampData} data */
export function getSprintPosition(data) {
  const week = getCurrentWeek(data);
  const day = getCurrentDay(data);
  const totalWeeks = data.sprint?.totalWeeks ?? 0;
  const totalDays = totalWeeks * 7;
  const currentWeek = week?.weekNumber ?? 0;
  const currentDay = day?.dayNumber ?? 0;
  return { currentWeek, totalWeeks, currentDay, totalDays };
}
