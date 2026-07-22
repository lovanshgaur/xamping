import { useEffect, useState } from "react";

/**
 * Opening splash screen. Shown once per session; fades out after the app
 * mounts. Honors `prefers-reduced-motion` via the global `data-reduced-motion`
 * attribute (transitions are neutralized in styles.css).
 */
export function LoadingScreen() {
  const [phase, setPhase] = useState("visible"); // visible → leaving → gone

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("leaving"), 900);
    const t2 = setTimeout(() => setPhase("gone"), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] grid place-items-center bg-background transition-opacity duration-500"
      style={{ opacity: phase === "leaving" ? 0 : 1, pointerEvents: phase === "leaving" ? "none" : "auto" }}
    >
      <div className="flex flex-col items-center gap-6">
        <img
          src="/app-icon-192.png"
          alt=""
          width={88}
          height={88}
          className="rounded-[14px] animate-[splash-in_600ms_ease-out_both]"
        />
        <div className="text-center">
          <p className="eyebrow">BootXamp</p>
          <p className="mt-2 text-sm text-muted-foreground">Career Operating System</p>
        </div>
        <div className="h-[2px] w-32 overflow-hidden bg-foreground/10">
          <div className="h-full w-1/3 bg-foreground animate-[splash-bar_1200ms_ease-in-out_infinite]" />
        </div>
      </div>
      <style>{`
        @keyframes splash-in {
          from { opacity: 0; transform: translateY(6px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes splash-bar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        [data-reduced-motion="true"] [class*="animate-[splash"] {
          animation: none !important;
        }
      `}</style>
    </div>
  );
}
