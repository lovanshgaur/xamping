import { cn } from "@/lib/utils";
import { orDash } from "@/utils/format";

/**
 * A hairline stat cell for detail pages.
 * @param {{ label: string, value: React.ReactNode, sub?: React.ReactNode, className?: string }} props
 */
export function StatCard({ label, value, sub, className }) {
  return (
    <div
      className={cn(
        "hairline pixel-corners rounded-[6px] bg-card/85 backdrop-blur-sm p-5 lift press transition-colors hover:bg-card",
        className,
      )}
    >
      <p className="pixel-font text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-display text-3xl font-semibold leading-none tracking-tight tabular-nums">
        {orDash(value)}
      </p>
      {sub ? <p className="mt-2 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}
