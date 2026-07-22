/**
 * Operate department input schema and score targets.
 * Targets are the "100%" reference — hitting or exceeding a target yields
 * a full contribution to the composite score. Scores are 0..1 clamped.
 */
export const OPERATE_INPUTS = Object.freeze([
  { id: "timeMoving", label: "Time Moving", unit: "min", step: 5, target: 45, category: "activity" },
  { id: "distance", label: "Distance Moved", unit: "km", step: 0.1, target: 5, category: "activity" },
  { id: "steps", label: "Steps", unit: "steps", step: 100, target: 8000, category: "activity" },
  { id: "calories", label: "Active Calories", unit: "kcal", step: 10, target: 500, category: "activity" },
  { id: "heartPoints", label: "Heart Points", unit: "pts", step: 1, target: 30, category: "activity" },
  { id: "sleepHours", label: "Hours Slept", unit: "h", step: 0.25, target: 8, category: "recovery" },
  { id: "studyHours", label: "Hours Studied", unit: "h", step: 0.25, target: 3, category: "study" },
  { id: "codingHours", label: "Coding Hours (WakaTime)", unit: "h", step: 0.25, target: 4, category: "coding" },
]);

export const OPERATE_INPUT_IDS = Object.freeze(OPERATE_INPUTS.map((i) => i.id));

export function emptyOperateMetrics() {
  const out = {};
  for (const i of OPERATE_INPUTS) out[i.id] = 0;
  return out;
}
