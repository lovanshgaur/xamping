import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/shared/Button";
import { Badge } from "@/components/shared/Badge";
import { ImportDialog } from "@/components/shared/ImportDialog";
import { ManagerProfile } from "@/components/manager/ManagerProfile";
import { DailyReviewForm } from "@/components/manager/DailyReviewForm";
import { WeeklyReviewForm } from "@/components/manager/WeeklyReviewForm";
import { useBootxamp } from "@/hooks/useBootxamp";
import { getCurrentDay, getCurrentWeek } from "@/lib/bootxamp/selectors";
import { formatDateShort } from "@/utils/dates";
import { Upload } from "lucide-react";

export const Route = createFileRoute("/manager")({
  head: () => ({
    meta: [
      { title: "Manager — BootXamp" },
      { name: "description", content: "Your Forge Labs manager: performance reviews, bonus XP, and mentor progression." },
      { property: "og:title", content: "Manager — BootXamp" },
      { property: "og:description", content: "Daily and weekly performance reviews from your assigned mentor." },
    ],
  }),
  component: ManagerPage,
});

function ManagerPage() {
  const { data } = useBootxamp();
  const [imp, setImp] = useState(false);

  const day = getCurrentDay(data);
  const week = getCurrentWeek(data);
  const dailyExisting = day ? data.reviews?.daily?.[day.id] : null;
  const weeklyExisting = week ? data.reviews?.weekly?.[week.id] : null;

  const dayTaskXP = useMemo(() => {
    if (!day) return 0;
    let xp = 0;
    for (const dept of day.departments) for (const t of dept.tasks) if (t.completed) xp += t.xp ?? 0;
    return xp;
  }, [day]);

  const recentReviews = useMemo(() => {
    const daily = Object.values(data.reviews?.daily ?? {}).map((r) => ({ ...r, kind: "daily" }));
    const weekly = Object.values(data.reviews?.weekly ?? {}).map((r) => ({ ...r, kind: "weekly" }));
    return [...daily, ...weekly].sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1)).slice(0, 8);
  }, [data.reviews]);

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <header className="flex flex-wrap items-start justify-between gap-4 pb-6 hairline-b">
        <div>
          <p className="eyebrow">Forge Labs · Engineering</p>
          <h1 className="mt-2 display-xxl">Manager</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Your assigned mentor reviews your work and awards bonus XP. Managers evolve as you rank up — each promotion unlocks a new relationship.
          </p>
        </div>
        <Button variant="outline" onClick={() => setImp(true)}>
          <Upload className="h-4 w-4" strokeWidth={1.5} /> Import
        </Button>
      </header>

      <ManagerProfile manager={data.manager} currentRankId={data.employee.overallRank} />

      <section>
        <SectionHeader eyebrow="Daily" title="Today’s Review" description="Live XP updates as scores change. Submits attach to the current day and feed analytics." />
        <div className="mt-6">
          {day ? (
            <DailyReviewForm
              dayId={day.id}
              dayLabel={`Day ${day.dayNumber}${day.theme ? ` · ${day.theme}` : ""}`}
              taskXP={dayTaskXP}
              existing={dailyExisting}
            />
          ) : (
            <EmptyState
              title="No day to review yet."
              description="Import a sprint, week, or day from the button above to begin."
            />
          )}
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Weekly" title="This Week’s Review" description="A coarser review awarded once per week. Bonus/penalty add to overall XP." />
        <div className="mt-6">
          {week ? (
            <WeeklyReviewForm
              weekId={week.id}
              weekLabel={`Week ${week.weekNumber}${week.title ? ` · ${week.title}` : ""}`}
              existing={weeklyExisting}
            />
          ) : (
            <EmptyState
              title="No week active."
              description="Weekly reviews unlock once a sprint is imported."
            />
          )}
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="History" title="Recent reviews" />
        <div className="mt-6">
          {recentReviews.length === 0 ? (
            <EmptyState title="No reviews submitted yet." description="Daily and weekly reviews appear here as they are recorded." />
          ) : (
            <ol className="hairline rounded-[6px] bg-surface">
              {recentReviews.map((r) => (
                <li key={r.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-5 py-4 hairline-b last:hairline-b-0">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={r.kind === "weekly" ? "solid" : "outline"}>{r.kind}</Badge>
                      <p className="truncate text-sm font-medium">
                        {r.kind === "daily" ? `Day review · ${Math.round((r.normalized ?? 0) * 100)}%` : `Weekly review · ${Math.round((r.normalized ?? 0) * 100)}%`}
                      </p>
                    </div>
                    {r.feedback ? (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{r.feedback}</p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg tabular-nums">
                      {r.xpAwarded >= 0 ? "+" : ""}
                      {r.xpAwarded} XP
                    </p>
                    <p className="meta">{formatDateShort(r.submittedAt)}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <ImportDialog open={imp} onOpenChange={setImp} />
    </div>
  );
}
