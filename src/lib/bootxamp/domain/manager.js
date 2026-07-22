import {
  DAILY_REVIEW_FIELDS,
  WEEKLY_REVIEW_FIELDS,
  REVIEW_MAX_SCORE,
  DAILY_REVIEW_XP_POOL,
  WEEKLY_REVIEW_XP_POOL,
  REVIEW_BONUS_CAP,
  REVIEW_PENALTY_CAP,
} from "@/constants/reviews";
import { MANAGER_TIERS, getManagerForRank } from "@/constants/managers";
import { getRank } from "./ranks";

/**
 * Compute the normalized 0..1 score for a review payload.
 * @param {Record<string, number>} scores
 * @param {readonly {id:string, weight:number}[]} fields
 */
export function normalizedReviewScore(scores, fields) {
  let weighted = 0;
  let total = 0;
  for (const f of fields) {
    const v = Math.max(0, Math.min(REVIEW_MAX_SCORE, Number(scores?.[f.id]) || 0));
    weighted += (v / REVIEW_MAX_SCORE) * f.weight;
    total += f.weight;
  }
  if (total <= 0) return 0;
  return weighted / total;
}

/**
 * XP derived from a daily review — pooled contribution + capped bonus/penalty.
 * @param {{scores:Record<string,number>, bonusXP?:number, penaltyXP?:number}} review
 */
export function computeDailyReviewXP(review) {
  const norm = normalizedReviewScore(review.scores ?? {}, DAILY_REVIEW_FIELDS);
  const bonus = Math.max(0, Math.min(REVIEW_BONUS_CAP, Number(review.bonusXP) || 0));
  const penalty = Math.max(0, Math.min(REVIEW_PENALTY_CAP, Number(review.penaltyXP) || 0));
  const base = Math.round(norm * DAILY_REVIEW_XP_POOL);
  return { normalized: norm, base, bonus, penalty, total: base + bonus - penalty };
}

/** @param {{scores:Record<string,number>, bonusXP?:number, penaltyXP?:number}} review */
export function computeWeeklyReviewXP(review) {
  const norm = normalizedReviewScore(review.scores ?? {}, WEEKLY_REVIEW_FIELDS);
  const bonus = Math.max(0, Math.min(REVIEW_BONUS_CAP, Number(review.bonusXP) || 0));
  const penalty = Math.max(0, Math.min(REVIEW_PENALTY_CAP, Number(review.penaltyXP) || 0));
  const base = Math.round(norm * WEEKLY_REVIEW_XP_POOL);
  return { normalized: norm, base, bonus, penalty, total: base + bonus - penalty };
}

/** Manager tier for the employee's current overall XP. */
export function getManagerForXP(xp) {
  const rank = getRank(xp);
  return getManagerForRank(rank.id);
}

/** All managers unlocked at or below `xp`. */
export function getUnlockedManagers(xp) {
  const rank = getRank(xp);
  const idx = MANAGER_TIERS.findIndex((m) => m.rankId === rank.id);
  return MANAGER_TIERS.slice(0, Math.max(0, idx) + 1);
}
