import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "./Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MOTION } from "@/constants/animations";

/**
 * @param {{ open:boolean, onClose:()=>void, from?: {name:string}, to?: {name:string} }} props
 */
export function PromotionModal({ open, onClose, from, to }) {
  const headingRef = useRef(null);
  const subRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, { y: 24, opacity: 0, duration: MOTION.promotion.duration, ease: MOTION.promotion.ease });
      gsap.from(subRef.current, { y: 12, opacity: 0, delay: 0.1, duration: MOTION.promotion.duration, ease: MOTION.promotion.ease });
    });
    return () => ctx.revert();
  }, [open, reduced]);

  if (!to) return null;
  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <DialogContent className="max-w-lg rounded-[6px] border-border bg-surface p-10 text-center">
        <p className="eyebrow">Promotion</p>
        <h2 ref={headingRef} className="mt-3 font-display text-5xl font-medium tracking-tight">
          {to.name}
        </h2>
        <p ref={subRef} className="mt-3 text-sm text-muted-foreground">
          From {from?.name ?? "—"}. Keep going.
        </p>
        <div className="mt-8 flex justify-center">
          <Button onClick={onClose}>Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
