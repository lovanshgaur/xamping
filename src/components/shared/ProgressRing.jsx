import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MOTION } from "@/constants/animations";
import { clamp01 } from "@/utils/xp";

/**
 * Concentric progress ring with an optional set of thin department arcs.
 * @param {{
 *   value: number,
 *   size?: number,
 *   thickness?: number,
 *   arcs?: {value:number,color:string}[],
 *   label?: string,
 *   centerLabel?: React.ReactNode,
 *   centerSub?: React.ReactNode,
 * }} props
 */
export function ProgressRing({
  value,
  size = 240,
  thickness = 14,
  arcs = [],
  centerLabel,
  centerSub,
}) {
  const reduced = useReducedMotion();
  const main = useRef(null);
  const arcRefs = useRef([]);
  const half = size / 2;
  const mainR = half - thickness;
  const mainC = 2 * Math.PI * mainR;
  const pct = clamp01(value ?? 0);

  const arcGeom = useMemo(() => {
    // Arcs sit outside the main ring, one per slot, distributed on the outer edge.
    return arcs.map((_, i) => {
      const r = half - 2;
      const c = 2 * Math.PI * r;
      const slotArc = c / arcs.length;
      return { r, c, slotArc, offset: slotArc * i };
    });
  }, [arcs.length, half]);

  useEffect(() => {
    const setMain = () => {
      if (!main.current) return;
      const dash = mainC * (1 - pct);
      main.current.style.strokeDashoffset = String(dash);
    };
    if (!main.current) return;
    if (reduced) {
      setMain();
    } else {
      gsap.fromTo(
        main.current,
        { strokeDashoffset: mainC },
        { strokeDashoffset: mainC * (1 - pct), duration: MOTION.progress.duration, ease: MOTION.progress.ease },
      );
    }

    arcs.forEach((arc, i) => {
      const el = arcRefs.current[i];
      if (!el) return;
      const geom = arcGeom[i];
      const fill = geom.slotArc * clamp01(arc.value);
      const gap = geom.slotArc - fill;
      if (reduced) {
        el.style.strokeDasharray = `${fill} ${geom.c - fill}`;
        el.style.strokeDashoffset = String(-geom.offset);
      } else {
        gsap.fromTo(
          el,
          { strokeDasharray: `0 ${geom.c}`, strokeDashoffset: -geom.offset },
          {
            strokeDasharray: `${fill} ${geom.c - fill}`,
            duration: MOTION.progress.duration,
            ease: MOTION.progress.ease,
          },
        );
      }
    });
  }, [pct, arcs, mainC, reduced, arcGeom]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={half}
          cy={half}
          r={mainR}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={thickness}
        />
        <circle
          ref={main}
          cx={half}
          cy={half}
          r={mainR}
          fill="none"
          stroke="var(--color-foreground)"
          strokeWidth={thickness}
          strokeDasharray={mainC}
          strokeDashoffset={mainC}
          strokeLinecap="butt"
        />
        {arcs.map((arc, i) => (
          <circle
            key={i}
            ref={(el) => {
              arcRefs.current[i] = el;
            }}
            cx={half}
            cy={half}
            r={arcGeom[i].r}
            fill="none"
            stroke={arc.color}
            strokeWidth={2}
            strokeDasharray={`0 ${arcGeom[i].c}`}
            strokeDashoffset={-arcGeom[i].offset}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-5xl font-medium tabular-nums leading-none">
          {centerLabel ?? "—"}
        </span>
        {centerSub ? <span className="mt-2 eyebrow">{centerSub}</span> : null}
      </div>
    </div>
  );
}
