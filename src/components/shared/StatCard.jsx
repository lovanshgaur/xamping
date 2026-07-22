import { cn } from "@/lib/utils";
import { orDash } from "@/utils/format";

/**
 * A hairline stat cell for detail pages.
 * @param {{ label: string, value: React.ReactNode, sub?: React.ReactNode, className?: string }} props
 */
export function StatCard({ label, value, sub, className }) {
  return (
    <div className={cn("hairline rounded-[6px] bg-surface p-5", className)}>
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-display text-3xl font-medium leading-none tracking-tight tabular-nums">
        {orDash(value)}
      </p>
      {sub ? <p className="mt-2 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}
