import { useCallback } from "react";
import { nanoid } from "nanoid";
import { useBootxamp } from "./useBootxamp";
import {
  computeDailyReviewXP,
  computeWeeklyReviewXP,
} from "@/lib/bootxamp/domain/manager";
import { DAILY_REVIEW_FIELDS, WEEKLY_REVIEW_FIELDS } from "@/constants/reviews";
import { levelFromXP } from "@/lib/bootxamp/domain/levels";
import { detectPromotion } from "@/lib/bootxamp/domain/promotions";
import { syncManagerToRank } from "@/lib/bootxamp/store";
import { appendTimeline, TIMELINE_EVENTS } from "@/lib/bootxamp/io";
import { nowIso } from "@/utils/dates";

export function emptyDailyReview() {
  const scores = {};
  for (const f of DAILY_REVIEW_FIELDS) scores[f.id] = 0;
  return { scores, bonusXP: 0, penaltyXP: 0, feedback: "" };
}
export function emptyWeeklyReview() {
  const scores = {};
  for (const f of WEEKLY_REVIEW_FIELDS) scores[f.id] = 0;
  return {
    scores,
    bonusXP: 0,
    penaltyXP: 0,
    feedback: "",
    promotionRecommendation: false,
  };
}

export function useManagerReview() {
  const { data, mutate } = useBootxamp();

  const submitDailyReview = useCallback(
    (dayId, review) => {
      let promotion = null;
      mutate((d) => {
        const week = d.weeks.find((w) => w.days.some((x) => x.id === dayId));
        if (!week) return;
        const day = week.days.find((x) => x.id === dayId);
        if (!day) return;

        const xp = computeDailyReviewXP(review);
        const prevXP = d.employee.overallXP;
        d.employee.overallXP = Math.max(0, prevXP + xp.total);
        d.employee.overallLevel = levelFromXP(d.employee.overallXP);
        d.employee.totalBonusXP += xp.bonus;
        d.employee.totalPenaltyXP += xp.penalty;
        d.employee.totalReviews += 1;

        d.reviews.daily[dayId] = {
          id: nanoid(),
          dayId,
          weekId: week.id,
          scores: review.scores,
          bonusXP: xp.bonus,
          penaltyXP: xp.penalty,
          feedback: review.feedback || "",
          normalized: xp.normalized,
          xpAwarded: xp.total,
          submittedAt: nowIso(),
        };

        const analyticsPoint = { date: day.date, value: Math.round(xp.normalized * 100) };
        const arr = (d.analytics.dailyReview = d.analytics.dailyReview ?? []);
        const idx = arr.findIndex((p) => p.date === day.date);
        if (idx >= 0) arr[idx] = analyticsPoint;
        else arr.push(analyticsPoint);
        arr.sort((a, b) => a.date.localeCompare(b.date));

        appendTimeline(d, {
          type: TIMELINE_EVENTS.REVIEW_SUBMITTED,
          title: `Manager reviewed Day ${day.dayNumber}`,
          description: `${Math.round(xp.normalized * 100)}% · ${xp.total >= 0 ? "+" : ""}${xp.total} XP`,
          metadata: { dayId, xp: xp.total },
        });

        const check = detectPromotion(prevXP, d.employee.overallXP);
        if (check.promoted) {
          d.employee.overallRank = check.to.id;
          const entry = {
            id: nanoid(),
            rank: check.to.id,
            atXP: d.employee.overallXP,
            occurredAt: nowIso(),
            metadata: { from: check.from.id, source: "dailyReview" },
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

  const submitWeeklyReview = useCallback(
    (weekId, review) => {
      let promotion = null;
      mutate((d) => {
        const week = d.weeks.find((w) => w.id === weekId);
        if (!week) return;
        const xp = computeWeeklyReviewXP(review);
        const prevXP = d.employee.overallXP;
        d.employee.overallXP = Math.max(0, prevXP + xp.total);
        d.employee.overallLevel = levelFromXP(d.employee.overallXP);
        d.employee.totalBonusXP += xp.bonus;
        d.employee.totalPenaltyXP += xp.penalty;

        d.reviews.weekly[weekId] = {
          id: nanoid(),
          weekId,
          scores: review.scores,
          bonusXP: xp.bonus,
          penaltyXP: xp.penalty,
          feedback: review.feedback || "",
          promotionRecommendation: !!review.promotionRecommendation,
          normalized: xp.normalized,
          xpAwarded: xp.total,
          submittedAt: nowIso(),
        };

        const arr = (d.analytics.weeklyReview = d.analytics.weeklyReview ?? []);
        arr.push({ date: nowIso().slice(0, 10), value: Math.round(xp.normalized * 100) });

        appendTimeline(d, {
          type: TIMELINE_EVENTS.REVIEW_SUBMITTED,
          title: `Manager weekly review · Week ${week.weekNumber}`,
          description: `${Math.round(xp.normalized * 100)}% · ${xp.total >= 0 ? "+" : ""}${xp.total} XP`,
          metadata: { weekId, xp: xp.total },
        });

        const check = detectPromotion(prevXP, d.employee.overallXP);
        if (check.promoted) {
          d.employee.overallRank = check.to.id;
          const entry = {
            id: nanoid(),
            rank: check.to.id,
            atXP: d.employee.overallXP,
            occurredAt: nowIso(),
            metadata: { from: check.from.id, source: "weeklyReview" },
          };
          d.employee.promotionHistory.push(entry);
          d.history.promotions.push(entry);
          syncManagerToRank(d);
          promotion = { from: check.from, to: check.to };
        }
      });
      return promotion;
    },
    [mutate],
  );

  return { data, submitDailyReview, submitWeeklyReview };
}
