import { useCallback, useEffect, useMemo, useState } from "react";
import { useBootxamp } from "./useBootxamp";
import { nowIso, todayISODate } from "@/utils/dates";
import { computeOperateScores } from "@/lib/bootxamp/domain/operate";
import { emptyOperateMetrics } from "@/constants/operate";

/**
 * Study timer with per-day persistence.
 *
 * Model
 * -----
 * - `entries`     : committed, deletable segments (created by Stop).
 * - `currentSeconds` : accumulated in the active run but not yet filed as an entry
 *                     (Pause holds this, Stop flushes it into an entry).
 * - `isRunning` / `startedAt` : the live run.
 *
 * totalSeconds (derived) = sum(entries.seconds) + currentSeconds + liveOffset
 *
 * On any change, today's total is pushed to
 *   operate.byDate[today].metrics.studyHours (and analytics.studyHours).
 *
 * Past days are read-only ("locked").
 */
export function useTimer(dateArg) {
  const { data, mutate } = useBootxamp();
  const today = todayISODate();
  const date = dateArg || today;
  const isToday = date === today;

  const raw = data.timer?.byDate?.[date] ?? null;

  // Force a re-render each second while running, so `Date.now()` reads refresh.
  const [, setTick] = useState(0);

  const entry = useMemo(
    () => ({
      date,
      isRunning: (raw?.isRunning ?? false) && isToday,
      startedAt: raw?.startedAt ?? null,
      currentSeconds: raw?.currentSeconds ?? 0,
      entries: Array.isArray(raw?.entries) ? raw.entries : [],
      locked: raw?.locked ?? !isToday,
      updatedAt: raw?.updatedAt ?? null,
    }),
    [raw, date, isToday],
  );

  useEffect(() => {
    if (!entry.isRunning) return;
    const id = setInterval(() => setTick((n) => (n + 1) % 1_000_000), 1000);
    return () => clearInterval(id);
  }, [entry.isRunning]);

  const liveOffset =
    entry.isRunning && entry.startedAt
      ? Math.max(0, Math.floor((Date.now() - new Date(entry.startedAt).getTime()) / 1000))
      : 0;

  const entriesTotal = entry.entries.reduce((sum, e) => sum + (e.seconds || 0), 0);
  const totalSeconds = entriesTotal + entry.currentSeconds + liveOffset;

  const writeStudyHours = (draft, seconds) => {
    if (!isToday) return;
    if (!draft.operate) draft.operate = { byDate: {} };
    const prev = draft.operate.byDate[date]?.metrics ?? emptyOperateMetrics();
    const nextMetrics = { ...prev, studyHours: +(seconds / 3600).toFixed(3) };
    draft.operate.byDate[date] = {
      date,
      metrics: nextMetrics,
      scores: computeOperateScores(nextMetrics),
      updatedAt: nowIso(),
    };
    const arr = (draft.analytics.studyHours = draft.analytics.studyHours ?? []);
    const i = arr.findIndex((p) => p.date === date);
    const point = { date, value: nextMetrics.studyHours };
    if (i >= 0) arr[i] = point;
    else arr.push(point);
    arr.sort((a, b) => a.date.localeCompare(b.date));
  };

  const ensureDay = (draft) => {
    if (!draft.timer) draft.timer = { byDate: {} };
    if (!draft.timer.byDate[date]) {
      draft.timer.byDate[date] = {
        date,
        isRunning: false,
        startedAt: null,
        currentSeconds: 0,
        entries: [],
        locked: false,
        updatedAt: nowIso(),
      };
    }
    return draft.timer.byDate[date];
  };

  const totalFor = (t) =>
    (t.entries ?? []).reduce((s, e) => s + (e.seconds || 0), 0) + (t.currentSeconds ?? 0);

  const start = useCallback(() => {
    if (!isToday) return;
    mutate((d) => {
      const t = ensureDay(d);
      if (t.isRunning) return;
      t.isRunning = true;
      t.startedAt = nowIso();
      t.locked = false;
      t.updatedAt = nowIso();
    });
  }, [date, isToday, mutate]);

  const pause = useCallback(() => {
    if (!isToday) return;
    mutate((d) => {
      const t = ensureDay(d);
      if (!t.isRunning) return;
      const started = t.startedAt ? new Date(t.startedAt).getTime() : Date.now();
      const seconds = Math.max(0, Math.floor((Date.now() - started) / 1000));
      t.currentSeconds = (t.currentSeconds ?? 0) + seconds;
      t.isRunning = false;
      t.startedAt = null;
      t.updatedAt = nowIso();
      writeStudyHours(d, totalFor(t));
    });
  }, [date, isToday, mutate]);

  /** Stop = file the current run (plus any held time) as a deletable entry. */
  const stop = useCallback(() => {
    if (!isToday) return;
    mutate((d) => {
      const t = ensureDay(d);
      let liveSecs = 0;
      let startedAt = t.startedAt;
      if (t.isRunning && t.startedAt) {
        const started = new Date(t.startedAt).getTime();
        liveSecs = Math.max(0, Math.floor((Date.now() - started) / 1000));
      } else {
        startedAt = null;
      }
      const seconds = (t.currentSeconds ?? 0) + liveSecs;
      if (seconds <= 0) {
        // nothing to log — just stop cleanly
        t.isRunning = false;
        t.startedAt = null;
        t.updatedAt = nowIso();
        return;
      }
      const endedAt = nowIso();
      const entryStart = startedAt ?? endedAt;
      t.entries = [
        ...(t.entries ?? []),
        {
          id: `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
          startedAt: entryStart,
          endedAt,
          seconds,
        },
      ];
      t.currentSeconds = 0;
      t.isRunning = false;
      t.startedAt = null;
      t.updatedAt = nowIso();
      writeStudyHours(d, totalFor(t));
    });
  }, [date, isToday, mutate]);

  const deleteEntry = useCallback(
    (entryId) => {
      if (!isToday) return;
      mutate((d) => {
        const t = ensureDay(d);
        t.entries = (t.entries ?? []).filter((e) => e.id !== entryId);
        t.updatedAt = nowIso();
        writeStudyHours(d, totalFor(t));
      });
    },
    [date, isToday, mutate],
  );

  const reset = useCallback(() => {
    if (!isToday) return;
    mutate((d) => {
      if (!d.timer) d.timer = { byDate: {} };
      d.timer.byDate[date] = {
        date,
        isRunning: false,
        startedAt: null,
        currentSeconds: 0,
        entries: [],
        locked: false,
        updatedAt: nowIso(),
      };
      writeStudyHours(d, 0);
    });
  }, [date, isToday, mutate]);

  // When the day rolls over, lock the previous day's entry.
  useEffect(() => {
    if (!isToday && raw && !raw.locked) {
      mutate((d) => {
        const t = d.timer?.byDate?.[date];
        if (!t) return;
        if (t.isRunning && t.startedAt) {
          const seconds = Math.max(
            0,
            Math.floor((Date.now() - new Date(t.startedAt).getTime()) / 1000),
          );
          t.currentSeconds = (t.currentSeconds ?? 0) + seconds;
        }
        t.isRunning = false;
        t.startedAt = null;
        t.locked = true;
        t.updatedAt = nowIso();
      });
    }
  }, [isToday, raw, date, mutate]);

  return {
    date,
    isToday,
    locked: entry.locked || !isToday,
    isRunning: entry.isRunning,
    totalSeconds,
    liveSeconds: entry.currentSeconds + liveOffset, // uncommitted (current run)
    entries: entry.entries,
    start,
    pause,
    stop,
    reset,
    deleteEntry,
  };
}
