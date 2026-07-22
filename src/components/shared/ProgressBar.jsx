import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MOTION } from "@/constants/animations";
import { clamp01 } from "@/utils/xp";

/**
 * Thin editorial progress bar.
 * @param {{ value: number, label?: string, trailing?: React.ReactNode, colorVar?: string, className?: string }} props
 */
export function ProgressBar({ value, label, trailing, colorVar, className }) {
  const ref = useRef(null);
  const reduced = useReducedMotion();
  const pct = clamp01(value ?? 0);

  useEffect(() => {
    if (!ref.current) return;
    if (reduced) {
      ref.current.style.transform = `scaleX(${pct})`;
      return;
    }
    gsap.fromTo(
      ref.current,
      { scaleX: 0 },
      { scaleX: pct, duration: MOTION.progress.duration, ease: MOTION.progress.ease },
    );
  }, [pct, reduced]);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label || trailing ? (
        <div className="flex items-baseline justify-between text-xs">
          <span className="pixel-font text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </span>
          <span className="pixel-font tabular-nums text-foreground">{trailing}</span>
        </div>
      ) : null}
      <div className="relative h-2.5 w-full overflow-hidden rounded-[2px] border border-border bg-muted/60">
        <div
          ref={ref}
          className="relative h-full origin-left"
          style={{ backgroundColor: colorVar ?? "var(--color-foreground)", transform: "scaleX(0)" }}
        />
        {/* Pixel segment overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 6px, color-mix(in oklab, var(--color-background) 65%, transparent) 6px 7px)",
          }}
        />
      </div>
    </div>
  );
}
