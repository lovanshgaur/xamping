import { useEffect, useState } from "react";
import { useBootxamp } from "./useBootxamp";

/** True when motion should be suppressed (setting or OS preference). */
export function useReducedMotion() {
  const { data } = useBootxamp();
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mql.matches);
    const handler = (e) => setPrefers(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const reduced = data.settings.reducedMotion || !data.settings.animations || prefers;

  // Sync the flag to <html> so CSS can short-circuit transitions/animations.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.reducedMotion = reduced ? "true" : "false";
  }, [reduced]);

  return reduced;
}

