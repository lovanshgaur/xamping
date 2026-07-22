import { useEffect } from "react";
import { useBootxamp } from "./useBootxamp";
import { DEFAULT_PALETTE, PALETTES } from "@/constants/themes";

/**
 * Applies the current mode (light/dark/system) and palette to <html>.
 * Palette is stored on `settings.palette` and drives a `data-theme` attribute.
 */
export function useTheme() {
  const { data, mutate } = useBootxamp();
  const theme = data.settings.theme;
  const palette = data.settings.palette ?? DEFAULT_PALETTE;

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const effective = theme === "system" ? (mql.matches ? "dark" : "light") : theme;
      root.classList.toggle("dark", effective === "dark");
    };
    apply();
    if (theme === "system") {
      mql.addEventListener("change", apply);
      return () => mql.removeEventListener("change", apply);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", palette);
  }, [palette]);

  const setTheme = (next) => {
    mutate((d) => {
      d.settings.theme = next;
    });
  };

  const setPalette = (next) => {
    const exists = PALETTES.some((p) => p.id === next);
    mutate((d) => {
      d.settings.palette = exists ? next : DEFAULT_PALETTE;
    });
  };

  return { theme, palette, setTheme, setPalette };
}
