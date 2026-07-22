import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { DAILY_REVIEW_FIELDS, REVIEW_MAX_SCORE } from "@/constants/reviews";
import { computeDailyReviewXP } from "@/lib/bootxamp/domain/manager";
import { emptyDailyReview, useManagerReview } from "@/hooks/useManagerReview";
import { cn } from "@/lib/utils";

/**
 * @param {{ dayId: string, dayLabel: string, taskXP: number, existing?: any, onSubmitted?: (p:any)=>void }} props
 */
export function DailyReviewForm({ dayId, dayLabel, taskXP, existing, onSubmitted }) {
  const { submitDailyReview } = useManagerReview();
  const [state, setState] = useState(() => {
    if (existing) {
      return {
        scores: existing.scores ?? {},
        bonusXP: existing.bonusXP ?? 0,
        penaltyXP: existing.penaltyXP ?? 0,
        feedback: existing.feedback ?? "",
      };
    }
    return emptyDailyReview();
  });

  const preview = computeDailyReviewXP(state);
  const finalXP = taskXP + preview.total;

  const setScore = (id, v) => setState((s) => ({ ...s, scores: { ...s.scores, [id]: v } }));

  const submit = () => {
    const p = submitDailyReview(dayId, state);
    onSubmitted?.(p);
  };

  return (
    <div className="space-y-6 rounded-[6px] bg-surface p-6 hairline">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <p className="eyebrow">Daily review</p>
          <h3 className="mt-1 font-display text-2xl font-medium tracking-tight">{dayLabel}</h3>
        </div>
        <p className="meta">Score out of {REVIEW_MAX_SCORE}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DAILY_REVIEW_FIELDS.map((f) => (
          <ScoreRow
            key={f.id}
            label={f.label}
            weight={f.weight}
            value={state.scores[f.id] ?? 0}
            onChange={(v) => setScore(f.id, v)}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberInput
          label="Bonus XP"
          value={state.bonusXP}
          onChange={(v) => setState((s) => ({ ...s, bonusXP: v }))}
        />
        <NumberInput
          label="Penalty XP"
          value={state.penaltyXP}
          onChange={(v) => setState((s) => ({ ...s, penaltyXP: v }))}
        />
      </div>

      <div>
        <label className="eyebrow">Written feedback</label>
        <textarea
          value={state.feedback}
          onChange={(e) => setState((s) => ({ ...s, feedback: e.target.value }))}
          rows={4}
          placeholder="What worked, what to improve, what to try next…"
          className="mt-2 w-full rounded-[4px] hairline bg-background p-3 text-sm outline-none focus:border-foreground"
        />
      </div>

      <XPBreakdown taskXP={taskXP} preview={preview} finalXP={finalXP} />

      <div className="flex justify-end">
        <Button onClick={submit}>Submit review</Button>
      </div>
    </div>
  );
}

function ScoreRow({ label, weight, value, onChange }) {
  return (
    <div className="rounded-[4px] bg-background p-4 hairline">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-medium">{label}</p>
        <p className="meta">×{weight.toFixed(2)}</p>
      </div>
      <div className="mt-3 flex items-center gap-1">
        {Array.from({ length: REVIEW_MAX_SCORE + 1 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            aria-pressed={value === i}
            className={cn(
              "h-8 flex-1 rounded-[3px] text-xs font-medium tabular-nums transition-colors hairline",
              value === i ? "border-foreground bg-foreground text-background" : "bg-background text-muted-foreground hover:bg-muted",
            )}
          >
            {i}
          </button>
        ))}
      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange }) {
  return (
    <label className="flex flex-col gap-2 rounded-[4px] bg-background p-4 hairline">
      <span className="eyebrow">{label}</span>
      <input
        type="number"
        min={0}
        value={value === 0 ? "" : value}
        placeholder="0"
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-full bg-transparent font-display text-2xl font-medium tabular-nums outline-none"
      />
    </label>
  );
}

function XPBreakdown({ taskXP, preview, finalXP }) {
  return (
    <div className="rounded-[4px] bg-background p-4 hairline">
      <p className="eyebrow">XP breakdown · live</p>
      <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-5">
        <li className="flex flex-col"><span className="meta">Task XP</span><span className="font-display text-xl tabular-nums">{taskXP}</span></li>
        <li className="flex flex-col"><span className="meta">Review</span><span className="font-display text-xl tabular-nums">+{preview.base}</span></li>
        <li className="flex flex-col"><span className="meta">Bonus</span><span className="font-display text-xl tabular-nums">+{preview.bonus}</span></li>
        <li className="flex flex-col"><span className="meta">Penalty</span><span className="font-display text-xl tabular-nums">-{preview.penalty}</span></li>
        <li className="flex flex-col border-l border-border pl-3"><span className="meta">Final XP</span><span className="font-display text-2xl tabular-nums">{finalXP}</span></li>
      </ul>
    </div>
  );
}
