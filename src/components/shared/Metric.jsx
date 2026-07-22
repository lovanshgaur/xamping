import { cn } from "@/lib/utils";
import { orDash } from "@/utils/format";

/**
 * Editorial metric block: small label above, oversized value below.
 * @param {{ label: string, value: React.ReactNode, unit?: string, hint?: string, className?: string }} props
 */
export function Metric({ label, value, unit, hint, className }) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <p className="eyebrow">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl font-medium leading-none tracking-tight tabular-nums">
          {orDash(value)}
        </span>
        {unit ? <span className="text-sm text-muted-foreground">{unit}</span> : null}
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
