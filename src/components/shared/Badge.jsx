import { cn } from "@/lib/utils";

/**
 * @param {{ variant?: "default"|"outline"|"solid"|"accent", children: React.ReactNode, className?: string }} props
 */
export function Badge({ variant = "default", children, className }) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    outline: "hairline text-foreground",
    solid: "bg-foreground text-background",
    accent: "bg-accent text-accent-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[4px] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em]",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
