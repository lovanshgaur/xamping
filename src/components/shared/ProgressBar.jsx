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
          <span className="text-muted-foreground">{label}</span>
          <span className="tabular-nums text-foreground">{trailing}</span>
        </div>
      ) : null}
      <div className="relative h-[3px] w-full overflow-hidden bg-border">
        <div
          ref={ref}
          className="absolute inset-0 origin-left"
          style={{ backgroundColor: colorVar ?? "var(--color-foreground)", transform: "scaleX(0)" }}
        />
      </div>
    </div>
  );
}
