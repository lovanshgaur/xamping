import { ProgressRing } from "@/components/shared/ProgressRing";
import { cn } from "@/lib/utils";

/**
 * @param {{ label: string, value: number, description?: string, size?: number, className?: string }} props
 */
export function ScoreCard({ label, value, description, size = 112, className }) {
  const pct = Math.round((value ?? 0) * 100);
  return (
    <div className={cn("flex items-center gap-5 rounded-[6px] bg-surface p-5 hairline", className)}>
      <ProgressRing
        value={value ?? 0}
        size={size}
        thickness={8}
        centerLabel={<span className="font-display text-2xl tabular-nums">{pct}</span>}
        centerSub="score"
      />
      <div className="min-w-0">
        <p className="eyebrow">{label}</p>
        <p className="mt-1 font-display text-2xl font-medium tabular-nums tracking-tight">{pct}%</p>
        {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      </div>
    </div>
  );
}
