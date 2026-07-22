import { useRouterState } from "@tanstack/react-router";
import { backgroundForPath } from "@/constants/backgrounds";

/**
 * Fixed pixel-art scene painted behind the entire app.
 * Two scrim layers guarantee UI legibility in both light and dark modes.
 */
export function AmbientBackground() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const url = backgroundForPath(pathname);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        key={url}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-75 dark:opacity-65 transition-opacity duration-700"
        style={{
          backgroundImage: `url("${url}")`,
          imageRendering: "pixelated",
        }}
      />
      {/* Accent color wash — ties the scene into the active palette */}
      <div className="absolute inset-0 opacity-20 mix-blend-soft-light bg-[radial-gradient(120%_90%_at_20%_10%,var(--color-accent)_0%,transparent_55%)]" />
      {/* Subtle scanline texture to reinforce retro feel */}
      <div
        className="absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.35) 0 1px, transparent 1px 3px)",
        }}
      />
      {/* Radial vignette — softer so scene stays vivid */}
      <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_45%,transparent_0%,color-mix(in_oklab,var(--color-background)_40%,transparent)_65%,color-mix(in_oklab,var(--color-background)_82%,transparent)_100%)]" />
      {/* Light top scrim under the header only */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/75 to-transparent" />
      {/* Light bottom scrim under mobile nav */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/80 to-transparent" />
    </div>
  );
}
