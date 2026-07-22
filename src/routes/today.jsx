import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { DepartmentSection } from "@/components/today/DepartmentSection";
import { SubmitDayBar } from "@/components/today/SubmitDayBar";
import { PromotionModal } from "@/components/shared/PromotionModal";
import { StatCard } from "@/components/shared/StatCard";
import { useBootxamp } from "@/hooks/useBootxamp";
import { useDayActions } from "@/hooks/useDayActions";
import { getCurrentDay } from "@/lib/bootxamp/selectors";
import { DEPARTMENTS, getDepartment } from "@/constants/departments";
import { formatHours, formatPercent } from "@/utils/format";
import { formatDateLong } from "@/utils/dates";
import { Badge } from "@/components/shared/Badge";

export const Route = createFileRoute("/today")({
  head: () => ({
    meta: [
      { title: "Today — BootXamp" },
      { name: "description", content: "What to do now. Today’s mission, tasks, and Submit Day flow." },
      { property: "og:title", content: "Today — BootXamp" },
      { property: "og:description", content: "Complete today’s tasks and submit the day." },
    ],
  }),
  component: TodayPage,
});

function TodayPage() {
  const { data } = useBootxamp();
  const day = getCurrentDay(data);
  const { toggleTask, setEvidence, submitDay } = useDayActions();
  const [promotion, setPromotion] = useState(null);

  if (!day) {
    return (
      <div className="mx-auto max-w-4xl">
        <SectionHeader eyebrow="Today" title="No mission assigned." description="Import a day, week, or sprint to begin." />
      </div>
    );
  }

  const locked = day.submitted;
  const totalTasks = day.departments.reduce((n, d) => n + d.tasks.length, 0);
  const doneTasks = day.departments.reduce((n, d) => n + d.tasks.filter((t) => t.completed).length, 0);

  const handleToggle = (deptSlug, taskId) => {
    const p = toggleTask(day.id, deptSlug, taskId);
    if (p) setPromotion(p);
  };

  const handleSubmit = (reflection) => {
    const outcome = submitDay(day.id, reflection);
    if (outcome.promotion) setPromotion(outcome.promotion);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-4 pb-6 hairline-b">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline">Day {day.dayNumber}</Badge>
          {day.submitted ? <Badge variant="solid">Submitted</Badge> : <Badge>{day.status}</Badge>}
          <span className="meta">{formatDateLong(day.date)}</span>
        </div>
        <h1 className="display-xl">{day.theme || "No theme"}</h1>
        <p className="max-w-2xl text-base text-muted-foreground">{day.mission || "No mission assigned."}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Estimated" value={day.estimatedHours ? formatHours(day.estimatedHours) : "—"} />
        <StatCard label="Tasks" value={totalTasks > 0 ? `${doneTasks}/${totalTasks}` : "—"} />
        <StatCard label="Progress" value={formatPercent(day.progress)} />
        <StatCard label="Score" value={day.score || 0} sub="XP earned today" />
      </div>

      {day.managerBrief ? (
        <section className="hairline rounded-[6px] bg-surface p-6">
          <p className="eyebrow mb-3">Manager Brief</p>
          <p className="text-sm text-foreground/90 whitespace-pre-line">{day.managerBrief}</p>
        </section>
      ) : (
        <EmptyState compact title="No manager brief." description="Managers can attach a brief per day via the imported JSON." />
      )}

      <div className="space-y-4">
        {DEPARTMENTS.map((meta) => {
          const dept = day.departments.find((d) => d.slug === meta.id);
          if (!dept) return null;
          return (
            <DepartmentSection
              key={meta.id}
              department={dept}
              dept={meta}
              locked={locked}
              onToggleTask={(taskId) => handleToggle(meta.id, taskId)}
              onEvidence={(taskId, ev) => setEvidence(day.id, meta.id, taskId, ev)}
            />
          );
        })}
      </div>

      {!locked ? (
        <SubmitDayBar
          onSubmit={handleSubmit}
          disabled={totalTasks === 0}
          dayLabel={`Day ${day.dayNumber}`}
        />
      ) : (
        <div className="hairline rounded-[6px] bg-surface p-4 text-center text-sm text-muted-foreground">
          Day {day.dayNumber} submitted. History is locked.
        </div>
      )}

      <PromotionModal
        open={Boolean(promotion)}
        onClose={() => setPromotion(null)}
        from={promotion?.from}
        to={promotion?.to}
      />
    </div>
  );
}
