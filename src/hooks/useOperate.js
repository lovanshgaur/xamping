import { useCallback, useMemo } from "react";
import { useBootxamp } from "./useBootxamp";
import { nowIso, todayISODate } from "@/utils/dates";
import { computeOperateScores, operateXPBonus } from "@/lib/bootxamp/domain/operate";
import { emptyOperateMetrics } from "@/constants/operate";
import { appendTimeline, TIMELINE_EVENTS } from "@/lib/bootxamp/io";

/**
 * Get + persist the daily Operate metrics for a given date (defaults to today).
 * All heavy math lives in the `operate` domain module; this hook is a thin
 * bridge between the UI and the store.
 */
export function useOperate(dateArg) {
  const { data, mutate } = useBootxamp();
  const date = dateArg || todayISODate();

  const entry = data.operate?.byDate?.[date] ?? null;
  const metrics = useMemo(
    () => ({ ...emptyOperateMetrics(), ...(entry?.metrics ?? {}) }),
    [entry],
  );
  const scores = useMemo(() => computeOperateScores(metrics), [metrics]);

  const setMetric = useCallback(
    (id, value) => {
      const numeric = Number.isFinite(value) ? Math.max(0, Number(value)) : 0;
      mutate((d) => {
        if (!d.operate) d.operate = { byDate: {} };
        const prev = d.operate.byDate[date]?.metrics ?? emptyOperateMetrics();
        const next = { ...prev, [id]: numeric };
        const nextScores = computeOperateScores(next);
        const wasEmpty = !d.operate.byDate[date];
        d.operate.byDate[date] = {
          date,
          metrics: next,
          scores: nextScores,
          updatedAt: nowIso(),
        };
        pushDailyAnalytics(d, date, next);
        if (wasEmpty) {
          appendTimeline(d, {
            type: TIMELINE_EVENTS.OPERATE_LOGGED,
            title: `Operate log started`,
            description: date,
            metadata: { date, source: "operate" },
          });
        }
        // Reserved: XP bonus is awarded once on day submission via
        // useDayActions to avoid double-counting during editing.
        void nextScores;
      });
    },
    [date, mutate],
  );

  return { date, metrics, scores, setMetric, xpPreview: operateXPBonus(scores) };
}

function pushDailyAnalytics(d, date, metrics) {
  const put = (key, value) => {
    const arr = (d.analytics[key] = d.analytics[key] ?? []);
    const i = arr.findIndex((p) => p.date === date);
    const entry = { date, value: Number(value) || 0 };
    if (i >= 0) arr[i] = entry;
    else arr.push(entry);
    arr.sort((a, b) => a.date.localeCompare(b.date));
  };
  put("sleepHours", metrics.sleepHours);
  put("studyHours", metrics.studyHours);
  put("codingHours", metrics.codingHours);
  put("steps", metrics.steps);
  put("distance", metrics.distance);
  put("calories", metrics.calories);
  put("heartPoints", metrics.heartPoints);
  put("timeMoving", metrics.timeMoving);
}
