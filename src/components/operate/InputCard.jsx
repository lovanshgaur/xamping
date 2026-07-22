import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { formatNumber } from "@/utils/format";

/**
 * Numeric input card used across the Operate dashboard.
 *
 * @param {{
 *   label: string,
 *   unit: string,
 *   value: number,
 *   step: number,
 *   target: number,
 *   category: string,
 *   ratio: number,
 *   onChange: (v:number)=>void,
 *   colorVar?: string,
 * }} props
 */
export function InputCard({ label, unit, value, step, target, category, ratio, onChange, colorVar }) {
  const dec = () => onChange(Math.max(0, roundStep(value - step, step)));
  const inc = () => onChange(roundStep(value + step, step));

  return (
    <div className="flex flex-col gap-4 rounded-[6px] bg-surface p-5 hairline transition-colors hover:border-foreground/40">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow">{category}</p>
          <p className="mt-1 font-display text-lg font-medium tracking-tight">{label}</p>
        </div>
        <p className="meta shrink-0">Target {formatNumber(target)} {unit}</p>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <input
            type="number"
            value={value === 0 ? "" : value}
            placeholder="0"
            min={0}
            step={step}
            onChange={(e) => {
              const n = Number(e.target.value);
              onChange(Number.isFinite(n) ? Math.max(0, n) : 0);
            }}
            className="w-24 bg-transparent font-display text-3xl font-medium tabular-nums tracking-tight outline-none focus:text-foreground"
          />
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{unit}</span>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={dec}
            className="grid h-8 w-8 place-items-center rounded-[4px] hairline text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Decrease ${label}`}
          >
            <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={inc}
            className="grid h-8 w-8 place-items-center rounded-[4px] hairline text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={`Increase ${label}`}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <ProgressBar
        value={ratio}
        label={`${Math.round(ratio * 100)}% of target`}
        trailing={value >= target ? "Complete" : `${formatNumber(Math.max(0, target - value))} to go`}
        colorVar={colorVar}
      />
    </div>
  );
}

function roundStep(v, step) {
  if (step >= 1) return Math.round(v);
  const digits = Math.max(0, Math.min(4, String(step).split(".")[1]?.length ?? 0));
  return Number(v.toFixed(digits));
}
