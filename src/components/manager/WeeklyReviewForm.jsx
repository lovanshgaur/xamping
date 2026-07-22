import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { WEEKLY_REVIEW_FIELDS, REVIEW_MAX_SCORE } from "@/constants/reviews";
import { computeWeeklyReviewXP } from "@/lib/bootxamp/domain/manager";
import { emptyWeeklyReview, useManagerReview } from "@/hooks/useManagerReview";
import { cn } from "@/lib/utils";

export function WeeklyReviewForm({ weekId, weekLabel, existing, onSubmitted }) {
  const { submitWeeklyReview } = useManagerReview();
  const [state, setState] = useState(() =>
    existing
      ? {
          scores: existing.scores ?? {},
          bonusXP: existing.bonusXP ?? 0,
          penaltyXP: existing.penaltyXP ?? 0,
          feedback: existing.feedback ?? "",
          promotionRecommendation: !!existing.promotionRecommendation,
        }
      : emptyWeeklyReview(),
  );

  const preview = computeWeeklyReviewXP(state);
  const setScore = (id, v) => setState((s) => ({ ...s, scores: { ...s.scores, [id]: v } }));

  const submit = () => {
    const p = submitWeeklyReview(weekId, state);
    onSubmitted?.(p);
  };

  return (
    <div className="space-y-6 rounded-[6px] bg-surface p-6 hairline">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow">Weekly review</p>
          <h3 className="mt-1 font-display text-2xl font-medium tracking-tight">{weekLabel}</h3>
        </div>
        <p className="meta">Score out of {REVIEW_MAX_SCORE}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {WEEKLY_REVIEW_FIELDS.map((f) => (
          <div key={f.id} className="rounded-[4px] bg-background p-4 hairline">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-medium">{f.label}</p>
              <p className="meta">×{f.weight.toFixed(2)}</p>
            </div>
            <div className="mt-3 flex items-center gap-1">
              {Array.from({ length: REVIEW_MAX_SCORE + 1 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setScore(f.id, i)}
                  aria-pressed={(state.scores[f.id] ?? 0) === i}
                  className={cn(
                    "h-8 flex-1 rounded-[3px] text-xs font-medium tabular-nums transition-colors hairline",
                    (state.scores[f.id] ?? 0) === i
                      ? "border-foreground bg-foreground text-background"
                      : "bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 rounded-[4px] bg-background p-4 hairline">
          <span className="eyebrow">Weekly bonus</span>
          <input
            type="number"
            min={0}
            value={state.bonusXP === 0 ? "" : state.bonusXP}
            placeholder="0"
            onChange={(e) => setState((s) => ({ ...s, bonusXP: Math.max(0, Number(e.target.value) || 0) }))}
            className="bg-transparent font-display text-2xl font-medium tabular-nums outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 rounded-[4px] bg-background p-4 hairline">
          <span className="eyebrow">Weekly penalty</span>
          <input
            type="number"
            min={0}
            value={state.penaltyXP === 0 ? "" : state.penaltyXP}
            placeholder="0"
            onChange={(e) => setState((s) => ({ ...s, penaltyXP: Math.max(0, Number(e.target.value) || 0) }))}
            className="bg-transparent font-display text-2xl font-medium tabular-nums outline-none"
          />
        </label>
      </div>

      <div>
        <label className="eyebrow">Weekly feedback</label>
        <textarea
          value={state.feedback}
          onChange={(e) => setState((s) => ({ ...s, feedback: e.target.value }))}
          rows={4}
          placeholder="Themes, trajectory, and what deserves emphasis next week."
          className="mt-2 w-full rounded-[4px] hairline bg-background p-3 text-sm outline-none focus:border-foreground"
        />
      </div>

      <label className="flex items-center justify-between rounded-[4px] bg-background p-4 hairline">
        <span>
          <span className="block text-sm font-medium">Promotion recommendation</span>
          <span className="block text-xs text-muted-foreground">Recorded on the timeline; ranks still promote automatically via XP.</span>
        </span>
        <input
          type="checkbox"
          checked={state.promotionRecommendation}
          onChange={(e) => setState((s) => ({ ...s, promotionRecommendation: e.target.checked }))}
          className="h-4 w-4"
        />
      </label>

      <div className="rounded-[4px] bg-background p-4 hairline">
        <p className="eyebrow">XP preview</p>
        <p className="mt-2 font-display text-3xl tabular-nums">
          {preview.total >= 0 ? "+" : ""}
          {preview.total}
        </p>
        <p className="text-xs text-muted-foreground">
          Base {preview.base} · Bonus +{preview.bonus} · Penalty -{preview.penalty}
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={submit}>Submit weekly review</Button>
      </div>
    </div>
  );
}
