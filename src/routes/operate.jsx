import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { InputCard } from "@/components/operate/InputCard";
import { ScoreCard } from "@/components/operate/ScoreCard";
import { GraphCard } from "@/components/shared/GraphCard";
import { useOperate } from "@/hooks/useOperate";
import { useBootxamp } from "@/hooks/useBootxamp";
import { OPERATE_INPUTS } from "@/constants/operate";
import { formatDateLong, todayISODate } from "@/utils/dates";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/operate")({
  head: () => ({
    meta: [
      { title: "Operate — BootXamp" },
      { name: "description", content: "Personal health, recovery, and performance dashboard for the apprenticeship." },
      { property: "og:title", content: "Operate — BootXamp" },
      { property: "og:description", content: "Sleep, movement, study and coding — the operating layer of your day." },
    ],
  }),
  component: OperatePage,
});

function OperatePage() {
  const { data } = useBootxamp();
  const { date, metrics, scores, setMetric, xpPreview } = useOperate();

  const categoryOrder = ["activity", "recovery", "study", "coding"];
  const grouped = useMemo(() => {
    const map = new Map(categoryOrder.map((c) => [c, []]));
    for (const input of OPERATE_INPUTS) map.get(input.category).push(input);
    return map;
  }, []);

  const overallSeries = useMemo(() => {
    const byDate = data.operate?.byDate ?? {};
    return Object.values(byDate)
      .map((e) => ({ date: e.date, value: Math.round((e.scores?.overall ?? 0) * 100) }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data.operate]);

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="grid gap-6 pb-6 hairline-b sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-end">
        <span
          className="grid h-14 w-14 place-items-center rounded-[6px] hairline"
          style={{ color: "var(--color-dept-operate)" }}
        >
          <Activity className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <div className="min-w-0">
          <p className="eyebrow">Operate · {formatDateLong(date)}</p>
          <h1 className="mt-2 display-xxl">Health & Performance</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Log the signals that drive your work. Sleep, movement, study, and coding compose your daily Operate score — and quietly feed weekly analytics.
          </p>
        </div>
        <div className="text-right">
          <p className="eyebrow">Bonus XP preview</p>
          <p className="mt-1 font-display text-3xl tabular-nums">+{xpPreview}</p>
          <p className="text-xs text-muted-foreground">awarded on day submit</p>
        </div>
      </header>

      <section>
        <SectionHeader eyebrow="Composite" title="Today’s Scores" description="Each score is the mean of its category, normalized to daily targets." />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <ScoreCard label="Activity" value={scores.activity} description="Movement, steps, calories, heart points" />
          <ScoreCard label="Recovery" value={scores.recovery} description="Sleep hours" />
          <ScoreCard label="Study" value={scores.study} description="Focused study time" />
          <ScoreCard label="Coding" value={scores.coding} description="Coding hours from WakaTime" />
          <ScoreCard label="Overall" value={scores.overall} description="Weighted mean of the four" />
        </div>
      </section>

      {categoryOrder.map((cat) => (
        <section key={cat}>
          <SectionHeader
            eyebrow={cat}
            title={sectionTitle(cat)}
            description={sectionDescription(cat)}
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grouped.get(cat).map((input) => (
              <InputCard
                key={input.id}
                label={input.label}
                unit={input.unit}
                value={metrics[input.id] ?? 0}
                step={input.step}
                target={input.target}
                category={cat}
                ratio={scores.perInput[input.id] ?? 0}
                onChange={(v) => setMetric(input.id, v)}
                colorVar="var(--color-dept-operate)"
              />
            ))}
          </div>
        </section>
      ))}

      <section>
        <SectionHeader eyebrow="Trend" title="Operate score over time" description="Composite daily score from every logged day." />
        <div className="mt-6">
          {overallSeries.length === 0 ? (
            <EmptyState title="No history yet." description="Log any input above to seed your first data point." />
          ) : (
            <GraphCard
              title="Overall Operate"
              description="Daily composite score (0–100)."
              data={overallSeries}
              variant="line"
              filename="bootxamp-operate.png"
            />
          )}
        </div>
      </section>
    </div>
  );
}

function sectionTitle(cat) {
  return {
    activity: "Movement & Activity",
    recovery: "Recovery",
    study: "Study",
    coding: "Coding",
  }[cat];
}

function sectionDescription(cat) {
  return {
    activity: "Time moving, distance, steps, calories, and heart points from your health tracker.",
    recovery: "Hours slept — the single lever with the highest downstream effect.",
    study: "Deliberate, focused learning time outside of tasks.",
    coding: "Editor time reported by WakaTime or your equivalent.",
  }[cat];
}
