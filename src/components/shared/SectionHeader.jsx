import { cn } from "@/lib/utils";

/**
 * Section header: eyebrow + title + optional actions + hairline rule below.
 * @param {{ eyebrow?: string, title: string, description?: string, actions?: React.ReactNode, className?: string }} props
 */
export function SectionHeader({ eyebrow, title, description, actions, className }) {
  return (
    <header className={cn("hairline-b pb-4", className)}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          {eyebrow ? <p className="eyebrow mb-2">{eyebrow}</p> : null}
          <h2 className="truncate font-display text-2xl font-medium tracking-tight sm:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </header>
  );
}
