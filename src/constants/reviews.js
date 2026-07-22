/**
 * Manager review scoring configuration.
 * All ranges are inclusive integers 0..maxScore.
 *
 * Formula (daily):
 *   reviewScore   = Σ(field.score * field.weight) / (maxScore * Σweights)   // 0..1
 *   reviewXP      = round(reviewScore * DAILY_REVIEW_XP_POOL)
 *   finalXP       = taskXP + reviewXP + bonusXP - penaltyXP + achievementXP
 *
 * Weekly review uses the same shape at a coarser cadence.
 */

export const DAILY_REVIEW_FIELDS = Object.freeze([
  { id: "workQuality", label: "Work Quality", weight: 1.25 },
  { id: "codeQuality", label: "Code Quality", weight: 1.25 },
  { id: "learningQuality", label: "Learning Quality", weight: 1.0 },
  { id: "effort", label: "Effort", weight: 1.0 },
  { id: "communication", label: "Communication", weight: 0.75 },
  { id: "initiative", label: "Initiative", weight: 0.75 },
  { id: "consistency", label: "Consistency", weight: 1.0 },
]);

export const WEEKLY_REVIEW_FIELDS = Object.freeze([
  { id: "overallPerformance", label: "Overall Performance", weight: 1.5 },
  { id: "weeklyRating", label: "Weekly Rating", weight: 1.0 },
]);

export const REVIEW_MAX_SCORE = 5;
export const DAILY_REVIEW_XP_POOL = 100;
export const WEEKLY_REVIEW_XP_POOL = 250;
export const REVIEW_PENALTY_CAP = 100;
export const REVIEW_BONUS_CAP = 500;
