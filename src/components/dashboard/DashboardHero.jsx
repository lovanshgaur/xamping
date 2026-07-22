import { Link } from "@tanstack/react-router";
import { Button } from "@/components/shared/Button";
import { formatDateLong } from "@/utils/dates";
import { getCurrentDay, getCurrentWeek, getSprintPosition } from "@/lib/bootxamp/selectors";
import { useBootxamp } from "@/hooks/useBootxamp";
import { ArrowRight } from "lucide-react";
import { orDash } from "@/utils/format";

export function DashboardHero() {
  const { data } = useBootxamp();
  const day = getCurrentDay(data);
  const week = getCurrentWeek(data);
  const pos = getSprintPosition(data);
  const hasSprint = Boolean(data.sprint);

  return (
    <section className="relative grid gap-8 py-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end sm:py-12 fade-up">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--color-accent) 55%, transparent), transparent)",
        }}
      />
      <div className="relative min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-5 items-center gap-1.5 rounded-full bg-foreground/5 px-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            {hasSprint ? `Day ${pos.currentDay || 0} / ${pos.totalDays || 0}` : "No Sprint"}
          </span>
          {hasSprint ? (
            <span className="eyebrow">
              Week {pos.currentWeek || 0} / {pos.totalWeeks || 0}
            </span>
          ) : null}
          <span className="eyebrow hidden sm:inline">·</span>
          <span className="eyebrow hidden sm:inline">{formatDateLong(new Date().toISOString())}</span>
        </div>
        <h1 className="mt-5 display-xxl fade-up fade-up-1">
          {orDash(day?.theme || week?.theme || data.manager.currentTheme)}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg fade-up fade-up-2">
          {orDash(day?.mission || data.manager.currentMission)}
        </p>
        <p className="mt-4 text-xs text-muted-foreground sm:hidden">
          {formatDateLong(new Date().toISOString())}
        </p>
      </div>
      <div className="relative flex shrink-0 items-center gap-3 fade-up fade-up-3">
        <Button as={Link} to="/today" size="lg" className="w-full sm:w-auto group press halo relative overflow-hidden">
          Open Today’s Work
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
        </Button>
      </div>
    </section>
  );
}

