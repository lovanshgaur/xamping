import { cn } from "@/lib/utils";

/**
 * Editorial empty state. Typography only — no illustrations, no icons.
 *
 * @param {{ title: string, description?: string, action?: React.ReactNode, className?: string, compact?: boolean }} props
 */
export function EmptyState({ title, description, action, className, compact = false }) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-center gap-3 hairline rounded-[6px] bg-surface",
        compact ? "p-6" : "p-10",
        className,
      )}
    >
      <p className="eyebrow">Nothing here</p>
      <h3 className={cn("font-display font-medium tracking-tight", compact ? "text-xl" : "text-3xl")}>
        {title}
      </h3>
      {description ? <p className="max-w-lg text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
