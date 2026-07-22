import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatCard } from "@/components/shared/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { DEPARTMENTS, getDepartment } from "@/constants/departments";
import { useBootxamp } from "@/hooks/useBootxamp";
import { getDepartmentXP, getDepartmentLevel, getCurrentWeek } from "@/lib/bootxamp/selectors";
import { formatNumber } from "@/utils/format";
import { formatDateShort } from "@/utils/dates";

/**
 * Generic department dashboard used by Learn / Build / Grow / Career / Operate.
 * Renders every specified block; each block shows an empty state when data is
 * missing rather than fake content.
 *
 * @param {{ slug: import("@/lib/bootxamp/schema").DepartmentId, sections?: {label:string, items?:string[]}[] }} props
 */
export function DepartmentDashboard({ slug, sections = [] }) {
  const { data } = useBootxamp();
  const dept = getDepartment(slug);
  const week = getCurrentWeek(data);
  const xp = getDepartmentXP(data, slug);
  const level = getDepartmentLevel(data, slug);

  const currentTopic = data.weeks
    .slice()
    .reverse()
    .flatMap((w) => w.days)
    .find((d) => d.departments.some((x) => x.slug === slug && x.tasks.length > 0))?.theme ?? "";

  const completedDays = data.weeks.flatMap((w) =>
    w.days.filter(
      (d) =>
        d.submitted &&
        d.departments.some((dept) => dept.slug === slug && dept.tasks.length > 0),
    ),
  );
  const upcomingDays = data.weeks.flatMap((w) =>
    w.days.filter(
      (d) =>
        !d.submitted &&
        d.departments.some((dept) => dept.slug === slug && dept.tasks.length > 0),
    ),
  );

  const history = data.history.timeline.filter(
    (t) => t.metadata && (t.metadata.deptSlug === slug || t.metadata.slug === slug),
  );

  return (
    <div className="space-y-10">
      <SectionHeader
        eyebrow={`Department · ${dept?.name ?? slug}`}
        title={`${dept?.name ?? slug} Progression`}
        description={dept?.description ?? ""}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Level" value={level} />
        <StatCard label="XP" value={formatNumber(xp)} />
        <StatCard label="Current Topic" value={currentTopic || "—"} />
        <StatCard
          label="Week Progress"
          value={
            week
              ? `${Math.round(
                  (week.days.filter((d) => d.departments.find((x) => x.slug === slug)?.tasks.every((t) => t.completed) ?? false).length /
                    Math.max(1, week.days.length)) *
                    100,
                )}%`
              : "—"
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ListBlock
          title="Completed Days"
          items={completedDays.map((d) => `Day ${d.dayNumber} — ${d.theme || "—"} · ${formatDateShort(d.date)}`)}
        />
        <ListBlock
          title="Upcoming Days"
          items={upcomingDays.map((d) => `Day ${d.dayNumber} — ${d.theme || "—"} · ${formatDateShort(d.date)}`)}
        />
      </div>

      <div>
        <SectionHeader eyebrow="Timeline" title="History" description="Events attributed to this department." />
        {history.length === 0 ? (
          <div className="mt-6">
            <EmptyState title="No history yet." description="Complete tasks in this department to fill the trail." />
          </div>
        ) : (
          <ol className="mt-6 hairline rounded-[6px] bg-surface">
            {history
              .slice()
              .reverse()
              .slice(0, 20)
              .map((h) => (
                <li key={h.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-5 py-3 hairline-b last:hairline-b-0 text-sm">
                  <span className="truncate">{h.title}</span>
                  <span className="text-xs text-muted-foreground">{h.type.replace(/_/g, " ")}</span>
                </li>
              ))}
          </ol>
        )}
      </div>

      {sections.map((s) => (
        <ListBlock key={s.label} title={s.label} items={s.items ?? []} />
      ))}
    </div>
  );
}

function ListBlock({ title, items }) {
  return (
    <div>
      <SectionHeader eyebrow={title} title={title} />
      {items.length === 0 ? (
        <div className="mt-6">
          <EmptyState compact title={`No ${title.toLowerCase()} available.`} />
        </div>
      ) : (
        <ul className="mt-6 hairline rounded-[6px] bg-surface">
          {items.map((it, i) => (
            <li key={i} className="px-5 py-3 hairline-b last:hairline-b-0 text-sm">
              {it}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
