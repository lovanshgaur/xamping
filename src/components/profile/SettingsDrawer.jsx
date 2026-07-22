import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/shared/Button";
import { useBootxamp } from "@/hooks/useBootxamp";
import { useTheme } from "@/hooks/useTheme";
import { APP } from "@/config/app";
import { formatBytes } from "@/utils/format";
import { localStorageBytes } from "@/utils/storage";
import { PALETTES } from "@/constants/themes";
import { cn } from "@/lib/utils";

/**
 * @param {{ open:boolean, onOpenChange:(v:boolean)=>void, onImport:()=>void, onExport:()=>void, onReset:()=>void }} props
 */
export function SettingsDrawer({ open, onOpenChange, onImport, onExport, onReset }) {
  const { data, mutate } = useBootxamp();
  const { theme, palette, setTheme, setPalette } = useTheme();
  const [bytes] = useState(() => localStorageBytes());

  const set = (patch) =>
    mutate((d) => {
      Object.assign(d.settings, patch);
    });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md border-border bg-surface p-0 sm:max-w-md">
        <SheetHeader className="p-6 hairline-b">
          <SheetTitle className="font-display text-2xl font-medium tracking-tight">Settings</SheetTitle>
        </SheetHeader>
        <div className="space-y-8 overflow-y-auto p-6" style={{ maxHeight: "calc(100vh - 88px)" }}>
          <Group title="Mode">
            <div className="grid grid-cols-3 gap-2">
              {["light", "dark", "system"].map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={theme === t ? "primary" : "outline"}
                  onClick={() => setTheme(t)}
                  className="capitalize press"
                >
                  {t}
                </Button>
              ))}
            </div>
          </Group>

          <Group title="Palette">
            <div className="grid grid-cols-2 gap-2">
              {PALETTES.map((p) => {
                const active = palette === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPalette(p.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-[6px] p-3 text-left transition-all hairline press",
                      active ? "border-foreground bg-foreground text-background" : "bg-surface hover:bg-muted",
                    )}
                    aria-pressed={active}
                  >
                    <span
                      className="h-6 w-6 shrink-0 rounded-full hairline"
                      style={{ backgroundColor: p.accent }}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{p.name}</span>
                      <span
                        className={cn(
                          "block truncate text-[11px]",
                          active ? "text-background/70" : "text-muted-foreground",
                        )}
                      >
                        {p.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Group>

          <Group title="Motion">
            <ToggleRow
              label="Animations"
              hint="Enable subtle GSAP transitions."
              checked={data.settings.animations}
              onChange={(v) => set({ animations: v })}
            />
            <ToggleRow
              label="Reduced motion"
              hint="Skip all motion regardless of OS preference."
              checked={data.settings.reducedMotion}
              onChange={(v) => set({ reducedMotion: v })}
            />
          </Group>

          <Group title="Data">
            <ToggleRow
              label="Auto-backup on reset"
              hint="Download a full JSON snapshot before wiping."
              checked={data.settings.exportBeforeReset}
              onChange={(v) => set({ exportBeforeReset: v })}
            />
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={onImport} className="press">Import</Button>
              <Button variant="outline" size="sm" onClick={onExport} className="press">Export</Button>
              <Button variant="destructive" size="sm" onClick={onReset} className="press">Reset</Button>
            </div>
          </Group>

          <Group title="About">
            <Row label="App" value={APP.name} />
            <Row label="Storage" value={formatBytes(bytes)} />
          </Group>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Group({ title, children }) {
  return (
    <div>
      <p className="eyebrow mb-3">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 hairline rounded-[6px] p-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
