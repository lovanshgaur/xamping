import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { GraphCard } from "@/components/shared/GraphCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAnalytics } from "@/hooks/useAnalytics";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — BootXamp" },
      { name: "description", content: "Patterns across XP, hours, sleep, applications, commits and health." },
      { property: "og:title", content: "Analytics — BootXamp" },
      { property: "og:description", content: "Patterns from your apprenticeship data, exportable to PNG." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const series = useAnalytics();
  const groups = [
    {
      eyebrow: "Career",
      title: "Momentum",
      description: "Cumulative XP, department contribution, and weekly closure.",
      charts: [
        { title: "XP over time", description: "Cumulative overall XP.", data: series.xp, variant: "line", filename: "bootxamp-xp.png" },
        { title: "Department Progress", description: "XP earned per department.", data: series.departmentProgress, variant: "bar", filename: "bootxamp-departments.png" },
        { title: "Weekly Completion", description: "% of tasks completed per week.", data: series.weeklyCompletion, variant: "bar", filename: "bootxamp-weekly.png" },
      ],
    },
    {
      eyebrow: "Operate",
      title: "Health & Performance",
      description: "The daily inputs from the Operate dashboard.",
      charts: [
        { title: "Overall Operate", description: "Composite daily score.", data: series.operateScore, variant: "line", filename: "bootxamp-operate.png" },
        { title: "Sleep", data: series.sleep, variant: "line", filename: "bootxamp-sleep.png" },
        { title: "Study Hours", data: series.study, variant: "line", filename: "bootxamp-study.png" },
        { title: "Coding Hours", data: series.coding, variant: "line", filename: "bootxamp-coding.png" },
        { title: "Steps", data: series.steps, variant: "bar", filename: "bootxamp-steps.png" },
        { title: "Heart Points", data: series.heartPoints, variant: "bar", filename: "bootxamp-heartpoints.png" },
        { title: "Calories Burned", data: series.calories, variant: "bar", filename: "bootxamp-calories.png" },
        { title: "Distance", data: series.distance, variant: "line", filename: "bootxamp-distance.png" },
        { title: "Weight history", data: series.weight, variant: "line", filename: "bootxamp-weight.png" },
      ],
    },
    {
      eyebrow: "Manager",
      title: "Ratings",
      description: "Normalized daily and weekly review scores.",
      charts: [
        { title: "Daily Reviews", description: "Score % from your manager.", data: series.dailyReview, variant: "line", filename: "bootxamp-daily-review.png" },
        { title: "Weekly Reviews", data: series.weeklyReview, variant: "bar", filename: "bootxamp-weekly-review.png" },
      ],
    },
    {
      eyebrow: "Career",
      title: "Outputs",
      description: "Applications and commits over time.",
      charts: [
        { title: "Applications", data: series.applications, variant: "bar", filename: "bootxamp-applications.png" },
        { title: "Commits", data: series.commits, variant: "bar", filename: "bootxamp-commits.png" },
        { title: "Focus", data: series.focus, variant: "line", filename: "bootxamp-focus.png" },
        { title: "Energy", data: series.energy, variant: "line", filename: "bootxamp-energy.png" },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      <SectionHeader
        eyebrow="Patterns"
        title="Analytics"
        description="Read-only signals derived from your data. Each graph exports as PNG."
      />

      {groups.map((g) => (
        <section key={g.title}>
          <SectionHeader eyebrow={g.eyebrow} title={g.title} description={g.description} />
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {g.charts.map((c) => {
              const empty = !c.data || c.data.length === 0;
              if (empty) {
                return (
                  <div key={c.title} className="rounded-[6px] bg-surface p-6 hairline">
                    <p className="eyebrow">{c.title}</p>
                    <div className="mt-4">
                      <EmptyState title="No data yet." description="This chart activates as data accumulates." />
                    </div>
                  </div>
                );
              }
              return <GraphCard key={c.title} {...c} />;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
