import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Play, Pause, Square, RotateCcw, Lock, Trash2 } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import deskStudy from "@/assets/pixel/desk-study.gif.asset.json";
import { StatCard } from "@/components/shared/StatCard";
import { useTimer } from "@/hooks/useTimer";
import { useBootxamp } from "@/hooks/useBootxamp";
import { todayISODate } from "@/utils/dates";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timer")({
  head: () => ({
    meta: [
      { title: "Timer — BootXamp" },
      {
        name: "description",
        content: "Study timer. Play, pause, stop to log an entry — every second lands in today's study hours.",
      },
      { property: "og:title", content: "Timer — BootXamp" },
      { property: "og:description", content: "Log your study time by the second." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TimerPage,
});

function pad(n) {
  return String(n).padStart(2, "0");
}
function formatHMS(total) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
function formatTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function TimerPage() {
  const [date, setDate] = useState(todayISODate());
  const timer = useTimer(date);
  const { data } = useBootxamp();

  useEffect(() => {
    const id = setInterval(() => {
      const t = todayISODate();
      if (t !== date) setDate(t);
    }, 30_000);
    return () => clearInterval(id);
  }, [date]);

  const hours = timer.totalSeconds / 3600;
  const entryCount = timer.entries.length;

  const history = Object.values(data.timer?.byDate ?? {})
    .filter((e) => e && e.date !== date)
    .map((e) => {
      const total =
        (e.entries ?? []).reduce((s, x) => s + (x.seconds || 0), 0) +
        (e.currentSeconds ?? 0);
      return { ...e, __total: total };
    })
    .filter((e) => e.__total > 0)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <div className="flex items-start gap-4 sm:gap-6">
        <div className="min-w-0 flex-1">
          <SectionHeader
            eyebrow="Focus"
            title="Study Timer"
            description="Play to start, pause to hold, stop to file the run as a deletable entry. Today's total feeds Operate → Hours Studied."
          />
        </div>
        <img
          src={deskStudy.url}
          alt="Pixel-art student at a desk, focused on the monitor"
          className="hidden shrink-0 rounded-[6px] hairline pixel-corners sm:block"
          style={{ imageRendering: "pixelated", width: 128, height: "auto" }}
        />
      </div>


      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Today" value={formatHMS(timer.totalSeconds)} sub="hh:mm:ss" />
        <StatCard label="Study hours" value={hours.toFixed(2)} sub="fed to Operate" />
        <StatCard label="Logged entries" value={String(entryCount)} sub="today" />
      </div>

      <div className="mt-6 relative overflow-hidden rounded-[6px] hairline pixel-corners bg-surface/80 backdrop-blur p-8 sm:p-12">
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 transition-opacity",
            timer.isRunning ? "opacity-70" : "opacity-30",
          )}
          style={{
            background:
              "radial-gradient(60% 60% at 50% 40%, color-mix(in oklab, var(--color-accent) 22%, transparent) 0%, transparent 70%)",
          }}
        />
        <div className="relative flex flex-col items-center">
          <p className="eyebrow flex items-center gap-2">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                timer.isRunning ? "bg-[var(--color-accent)] animate-pulse" : "bg-muted-foreground/50",
              )}
            />
            {timer.locked
              ? "Locked"
              : timer.isRunning
                ? "Running"
                : timer.liveSeconds > 0
                  ? "Paused"
                  : "Ready"}
          </p>
          <div
            className={cn(
              "mt-3 font-display font-medium tabular-nums tracking-tight",
              "text-[64px] leading-none sm:text-[112px]",
            )}
            style={{ letterSpacing: "-0.03em" }}
          >
            {formatHMS(timer.totalSeconds)}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {timer.date}
            {timer.liveSeconds > 0 ? (
              <>
                {" · "}
                <span className="text-foreground/80">
                  current run {formatHMS(timer.liveSeconds)}
                </span>
              </>
            ) : null}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {timer.locked ? (
              <div className="flex items-center gap-2 rounded-[6px] hairline px-4 py-3 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" strokeWidth={1.5} />
                Past days are locked
              </div>
            ) : (
              <>
                {timer.isRunning ? (
                  <button
                    type="button"
                    onClick={timer.pause}
                    className="press flex items-center gap-2 rounded-[6px] bg-foreground px-6 py-3 text-sm font-medium text-background"
                  >
                    <Pause className="h-4 w-4" strokeWidth={2} />
                    Pause
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={timer.start}
                    className="press flex items-center gap-2 rounded-[6px] bg-[var(--color-accent)] px-6 py-3 text-sm font-medium text-[var(--color-accent-foreground)]"
                  >
                    <Play className="h-4 w-4" strokeWidth={2} />
                    {timer.liveSeconds > 0 ? "Resume" : "Start"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={timer.stop}
                  disabled={!timer.isRunning && timer.liveSeconds === 0}
                  className="press flex items-center gap-2 rounded-[6px] hairline bg-surface px-6 py-3 text-sm font-medium text-foreground disabled:opacity-40"
                >
                  <Square className="h-4 w-4" strokeWidth={2} fill="currentColor" />
                  Stop &amp; log
                </button>
                <button
                  type="button"
                  onClick={timer.reset}
                  disabled={timer.totalSeconds === 0 && !timer.isRunning}
                  className="press flex items-center gap-2 rounded-[6px] hairline bg-surface px-6 py-3 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={1.75} />
                  Reset
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Today's logged entries — deletable while the day is not over */}
      <div className="mt-10">
        <div className="mb-3 flex items-end justify-between">
          <p className="eyebrow">Today&rsquo;s entries</p>
          <span className="text-[11px] text-muted-foreground">
            {timer.locked
              ? "locked at midnight"
              : `${entryCount} logged · deletable until midnight`}
          </span>
        </div>
        {entryCount === 0 ? (
          <div className="rounded-[6px] hairline bg-surface/70 backdrop-blur p-6 text-sm text-muted-foreground">
            No entries yet. Hit <span className="text-foreground">Stop &amp; log</span> to file the current run.
          </div>
        ) : (
          <ul className="rounded-[6px] hairline bg-surface/70 backdrop-blur divide-y divide-border">
            {[...timer.entries]
              .sort((a, b) => (b.endedAt || "").localeCompare(a.endedAt || ""))
              .map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[4px] bg-muted text-[10px] tabular-nums text-muted-foreground">
                      {formatTime(e.startedAt)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm">
                        {formatTime(e.startedAt)} → {formatTime(e.endedAt)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {(e.seconds / 60).toFixed(1)} min
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="font-display tabular-nums">{formatHMS(e.seconds)}</span>
                    {timer.locked ? (
                      <Lock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                    ) : (
                      <button
                        type="button"
                        onClick={() => timer.deleteEntry(e.id)}
                        className="press grid h-8 w-8 place-items-center rounded-[4px] hairline text-muted-foreground hover:text-foreground"
                        aria-label="Delete entry"
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Past days */}
      <div className="mt-10">
        <p className="eyebrow mb-3">Recent days</p>
        {history.length === 0 ? (
          <div className="rounded-[6px] hairline bg-surface/70 backdrop-blur p-6 text-sm text-muted-foreground">
            No previous timer sessions yet. Once today rolls over, totals move here and become read-only.
          </div>
        ) : (
          <ul className="rounded-[6px] hairline bg-surface/70 backdrop-blur divide-y divide-border">
            {history.map((e) => (
              <li key={e.date} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                  <span className="text-sm">{e.date}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">
                    {(e.entries?.length ?? 0)} entries
                  </span>
                  <span className="font-display tabular-nums">
                    {formatHMS(e.__total)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
