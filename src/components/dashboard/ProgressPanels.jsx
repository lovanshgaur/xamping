import { ProgressRing } from "@/components/shared/ProgressRing";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { DEPARTMENTS } from "@/constants/departments";
import { useBootxamp } from "@/hooks/useBootxamp";
import {
  getCurrentDay,
  getCurrentWeek,
  getDeptProgress,
  getWeekDeptProgress,
  getWeekProgress,
} from "@/lib/bootxamp/selectors";
import { formatPercent } from "@/utils/format";

export function WeeklyProgressPanel() {
  const { data } = useBootxamp();
  const week = getCurrentWeek(data);
  const weekPct = getWeekProgress(week);

  const arcs = DEPARTMENTS.map((d) => ({
    value: getWeekDeptProgress(week, d.id),
    color: d.strokeVar,
  }));

  return (
    <section className="py-10">
      <SectionHeader
        eyebrow="Where I am"
        title="Weekly Progress"
        description="Overall completion of the current week with per-department arcs."
      />
      <div className="mt-8 grid gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
        <div className="flex justify-center">
          <ProgressRing
            value={weekPct}
            size={260}
            thickness={16}
            arcs={arcs}
            centerLabel={week ? formatPercent(weekPct) : "—"}
            centerSub={week ? `Week ${week.weekNumber}` : "No Week"}
          />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {DEPARTMENTS.map((d) => {
            const v = getWeekDeptProgress(week, d.id);
            const Icon = d.icon;
            return (
              <li key={d.id} className="hairline rounded-[6px] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-sm font-medium">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.5} style={{ color: d.strokeVar }} />
                    {d.name}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">{formatPercent(v)}</span>
                </div>
                <ProgressBar value={v} colorVar={d.strokeVar} />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function TodayProgressPanel() {
  const { data } = useBootxamp();
  const day = getCurrentDay(data);
  return (
    <section className="py-10">
      <SectionHeader
        eyebrow="Right now"
        title="Today’s Progress"
        description="Per-department completion for the active day."
      />
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {DEPARTMENTS.map((d) => {
          const v = getDeptProgress(day, d.id);
          const Icon = d.icon;
          const dept = day?.departments.find((x) => x.slug === d.id);
          const total = dept?.tasks.length ?? 0;
          const done = dept?.tasks.filter((t) => t.completed).length ?? 0;
          return (
            <li key={d.id} className="hairline rounded-[6px] p-5">
              <div className="mb-3 flex items-center gap-2">
                <Icon className="h-4 w-4" strokeWidth={1.5} style={{ color: d.strokeVar }} />
                <span className="text-sm font-medium">{d.name}</span>
              </div>
              <p className="mb-3 font-display text-2xl font-medium tabular-nums">
                {total > 0 ? `${done}/${total}` : "—"}
              </p>
              <ProgressBar value={v} colorVar={d.strokeVar} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
