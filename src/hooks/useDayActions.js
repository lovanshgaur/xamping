import { useCallback } from "react";
import { useBootxamp } from "./useBootxamp";
import { awardForTask, weeklyCompletionBonus, consistencyBonus } from "@/lib/bootxamp/domain/xp";
import { detectPromotion } from "@/lib/bootxamp/domain/promotions";
import { computeOverallStreak } from "@/lib/bootxamp/domain/streaks";
import { computeOperateScores, operateXPBonus } from "@/lib/bootxamp/domain/operate";
import { syncManagerToRank } from "@/lib/bootxamp/store";
import { appendTimeline, TIMELINE_EVENTS } from "@/lib/bootxamp/io";
import { levelFromXP } from "@/lib/bootxamp/domain/levels";
import { nowIso, todayISODate } from "@/utils/dates";
import { nanoid } from "nanoid";

/**
 * Encapsulates all mutations against a Day: toggling tasks, editing evidence,
 * and submitting the day. Business rules stay pure inside the domain layer.
 */
export function useDayActions() {
  const { mutate, data } = useBootxamp();

  const toggleTask = useCallback(
    (dayId, deptSlug, taskId) => {
      let promotion = null;
      mutate((d) => {
        const { day, dept, task } = locate(d, dayId, deptSlug, taskId);
        if (!day || day.submitted || !dept || !task) return;

        const willComplete = !task.completed;
        task.completed = willComplete;
        task.completedAt = willComplete ? nowIso() : null;
        task.updatedAt = nowIso();
        task.xp = task.xp || (willComplete ? awardForTask(task) : task.xp);

        const delta = (willComplete ? 1 : -1) * (task.xp || 0);
        const prevXP = d.employee.overallXP;
        d.employee.overallXP = Math.max(0, prevXP + delta);
        dept.xp = Math.max(0, dept.xp + delta);
        dept.level = levelFromXP(dept.xp);
        d.employee.overallLevel = levelFromXP(d.employee.overallXP);
        d.employee.totalTasksCompleted += willComplete ? 1 : -1;

        recomputeDayProgress(day);

        if (willComplete) {
          appendTimeline(d, {
            type: TIMELINE_EVENTS.TASK_COMPLETED,
            title: task.title,
            description: dept.name,
            metadata: { dayId, deptSlug, taskId, xp: task.xp },
          });
        } else {
          appendTimeline(d, {
            type: TIMELINE_EVENTS.TASK_UNCHECKED,
            title: task.title,
            description: dept.name,
            metadata: { dayId, deptSlug, taskId },
          });
        }

        const streak = computeOverallStreak(d);
        d.employee.currentStreak = streak.current;
        if (streak.longest > d.employee.longestStreak) d.employee.longestStreak = streak.longest;

        const check = detectPromotion(prevXP, d.employee.overallXP);
        if (check.promoted) {
          d.employee.overallRank = check.to.id;
          const entry = {
            id: nanoid(),
            rank: check.to.id,
            atXP: d.employee.overallXP,
            occurredAt: nowIso(),
            metadata: { from: check.from.id },
          };
          d.employee.promotionHistory.push(entry);
          d.history.promotions.push(entry);
          syncManagerToRank(d);
          appendTimeline(d, {
            type: TIMELINE_EVENTS.PROMOTION_EARNED,
            title: `Promoted to ${check.to.name}`,
            description: `From ${check.from.name}`,
            metadata: entry,
          });
          promotion = { from: check.from, to: check.to };
        }
      });
      return promotion;
    },
    [mutate],
  );

  const setEvidence = useCallback(
    (dayId, deptSlug, taskId, evidence) => {
      mutate((d) => {
        const { day, task } = locate(d, dayId, deptSlug, taskId);
        if (!day || day.submitted || !task) return;
        task.evidence = evidence;
        task.updatedAt = nowIso();
      });
    },
    [mutate],
  );

  const submitDay = useCallback(
    (dayId, reflection = "") => {
      let outcome = { promotion: null, weekCompleted: false };
      mutate((d) => {
        const week = d.weeks.find((w) => w.days.some((x) => x.id === dayId));
        if (!week) return;
        const day = week.days.find((x) => x.id === dayId);
        if (!day || day.submitted) return;

        day.submitted = true;
        day.completed = true;
        day.status = "submitted";
        day.updatedAt = nowIso();
        recomputeDayProgress(day);
        day.score = computeDayScore(day);

        if (!day.review) day.review = blankReview();
        day.review.employeeReflection = reflection;
        day.review.submittedAt = nowIso();
        day.review.updatedAt = nowIso();
        d.employee.totalReviews += 1;

        const prevXP = d.employee.overallXP;
        const operateEntry = d.operate?.byDate?.[day.date];
        const operateScores = operateEntry
          ? computeOperateScores(operateEntry.metrics)
          : null;
        const operateBonus = operateScores ? operateXPBonus(operateScores) : 0;
        d.employee.overallXP += consistencyBonus() + operateBonus;
        if (operateEntry) operateEntry.scores = operateScores;

        appendTimeline(d, {
          type: TIMELINE_EVENTS.DAY_SUBMITTED,
          title: `Day ${day.dayNumber} submitted`,
          description: day.mission || day.theme || "",
          metadata: { dayId, score: day.score },
        });
        appendTimeline(d, {
          type: TIMELINE_EVENTS.REVIEW_SUBMITTED,
          title: `Reflection for Day ${day.dayNumber}`,
          metadata: { dayId },
        });

        // Carry forward incomplete tasks to next day, if any.
        const idx = week.days.findIndex((x) => x.id === dayId);
        const next = week.days[idx + 1];
        if (next && !next.submitted) {
          for (const dept of day.departments) {
            const nextDept = next.departments.find((x) => x.slug === dept.slug);
            if (!nextDept) continue;
            for (const t of dept.tasks) {
              if (!t.completed) {
                nextDept.tasks.push({
                  ...t,
                  id: nanoid(),
                  completed: false,
                  completedAt: null,
                  createdAt: nowIso(),
                  updatedAt: nowIso(),
                  metadata: { ...(t.metadata || {}), carriedFrom: day.id },
                });
              }
            }
          }
          next.updatedAt = nowIso();
        }

        // Week completion
        recomputeWeekProgress(week);
        if (week.days.every((x) => x.submitted)) {
          week.completed = true;
          d.employee.overallXP += weeklyCompletionBonus();
          outcome.weekCompleted = true;
        }

        d.employee.overallLevel = levelFromXP(d.employee.overallXP);

        const check = detectPromotion(prevXP, d.employee.overallXP);
        if (check.promoted) {
          d.employee.overallRank = check.to.id;
          const entry = {
            id: nanoid(),
            rank: check.to.id,
            atXP: d.employee.overallXP,
            occurredAt: nowIso(),
            metadata: { from: check.from.id, source: "submitDay" },
          };
          d.employee.promotionHistory.push(entry);
          d.history.promotions.push(entry);
          syncManagerToRank(d);
          appendTimeline(d, {
            type: TIMELINE_EVENTS.PROMOTION_EARNED,
            title: `Promoted to ${check.to.name}`,
            description: `From ${check.from.name}`,
            metadata: entry,
          });
          outcome.promotion = { from: check.from, to: check.to };
        }

        // Advance app cursor.
        const nextDay = week.days[idx + 1];
        if (nextDay) d.app.currentDayId = nextDay.id;
      });
      return outcome;
    },
    [mutate],
  );

  return { toggleTask, setEvidence, submitDay, data };
}

/* ------------------------------ Helpers ------------------------------ */

function locate(d, dayId, deptSlug, taskId) {
  for (const w of d.weeks) {
    const day = w.days.find((x) => x.id === dayId);
    if (!day) continue;
    const dept = day.departments.find((x) => x.slug === deptSlug);
    if (!dept) return { day, dept: null, task: null };
    const task = dept.tasks.find((t) => t.id === taskId);
    return { day, dept, task };
  }
  return { day: null, dept: null, task: null };
}

function recomputeDayProgress(day) {
  const all = day.departments.flatMap((d) => d.tasks);
  day.progress = all.length === 0 ? 0 : all.filter((t) => t.completed).length / all.length;
  day.completed = day.progress === 1;
}

function recomputeWeekProgress(week) {
  if (week.days.length === 0) {
    week.progress = 0;
    return;
  }
  week.progress = week.days.reduce((acc, d) => acc + d.progress, 0) / week.days.length;
}

function computeDayScore(day) {
  let xp = 0;
  for (const dept of day.departments) {
    for (const t of dept.tasks) if (t.completed) xp += t.xp ?? 0;
  }
  return xp;
}

function blankReview() {
  return {
    id: nanoid(),
    strengths: [],
    weaknesses: [],
    blockers: [],
    managerRemarks: "",
    employeeReflection: "",
    overallRating: 0,
    submittedAt: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    metadata: {},
  };
}
