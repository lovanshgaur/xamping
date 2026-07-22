import { OPERATE_INPUTS, emptyOperateMetrics } from "@/constants/operate";
import { clamp01 } from "@/utils/xp";

/**
 * Compute per-category and overall Operate scores from a metrics object.
 * Each category is the mean of its inputs' ratio to target, clamped to 1.
 *
 * @param {Record<string, number>} metrics
 * @returns {{
 *   activity:number, recovery:number, study:number, coding:number, overall:number,
 *   perInput: Record<string, number>
 * }}
 */
export function computeOperateScores(metrics) {
  const m = { ...emptyOperateMetrics(), ...(metrics ?? {}) };
  const buckets = { activity: [], recovery: [], study: [], coding: [] };
  const perInput = {};
  for (const input of OPERATE_INPUTS) {
    const raw = Number(m[input.id]) || 0;
    const ratio = input.target > 0 ? clamp01(raw / input.target) : 0;
    perInput[input.id] = ratio;
    buckets[input.category].push(ratio);
  }
  const mean = (arr) => (arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length);
  const activity = mean(buckets.activity);
  const recovery = mean(buckets.recovery);
  const study = mean(buckets.study);
  const coding = mean(buckets.coding);
  const overall = (activity + recovery + study + coding) / 4;
  return { activity, recovery, study, coding, overall, perInput };
}

/**
 * XP modifier from an Operate day: up to +15 XP for a perfect overall score.
 * Kept small so Operate rewards consistency without dominating career XP.
 */
export function operateXPBonus(scores) {
  return Math.round((scores?.overall ?? 0) * 15);
}
