/**
 * BootXamp palette + mode themes.
 *
 * `mode` controls light / dark / system.
 * `palette` swaps the accent + department chromatic set via a `data-theme`
 * attribute on <html>. Styles live in `src/styles.css`.
 */
export const THEME_MODES = Object.freeze(["light", "dark", "system"]);
export const DEFAULT_THEME_MODE = "system";

export const PALETTES = Object.freeze([
  { id: "editorial", name: "Editorial", accent: "#e05a2b", description: "Warm orange on ink. The default." },
  { id: "ocean", name: "Ocean", accent: "#1e88e5", description: "Deep, quiet blue." },
  { id: "forest", name: "Forest", accent: "#3d9970", description: "Grounded green." },
  { id: "sunset", name: "Sunset", accent: "#ff6f61", description: "Faded coral pink." },
  { id: "violet", name: "Violet", accent: "#7c4dff", description: "Electric ultraviolet." },
  { id: "mono", name: "Mono", accent: "#3a3a3a", description: "Pure greyscale." },
  { id: "neon", name: "Neon", accent: "#c6ff00", description: "High-contrast acid green." },
  { id: "sepia", name: "Sepia", accent: "#a0673f", description: "Newsprint warmth." },
]);

export const DEFAULT_PALETTE = "editorial";
