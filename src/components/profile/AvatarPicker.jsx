import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/shared/Button";
import { useBootxamp } from "@/hooks/useBootxamp";
import { AVATAR_PRESETS, AVATAR_STYLE, getPersona } from "@/constants/avatars";
import { normalizeAvatar } from "@/lib/bootxamp/domain/avatar";
import { cn } from "@/lib/utils";

/**
 * Pixel-art avatar picker: eleven curated characters, one style.
 * @param {{ open:boolean, onOpenChange:(v:boolean)=>void }} props
 */
export function AvatarPicker({ open, onOpenChange }) {
  const { data, mutate } = useBootxamp();
  const current = normalizeAvatar(data.employee.avatar);
  const [seed, setSeed] = useState(current.seed);

  const save = () => {
    mutate((d) => {
      d.employee.avatar = { style: AVATAR_STYLE, seed };
      d.employee.updatedAt = new Date().toISOString();
    });
    onOpenChange(false);
  };

  const persona = getPersona(seed);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[6px] border-border bg-surface">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-medium tracking-tight">
            Choose your character
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Eleven pixel-art personas. Pick one — it persists across every screen.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-[180px_minmax(0,1fr)]">
          <div className="flex flex-col items-center gap-3">
            <div className="grid h-44 w-44 place-items-center overflow-hidden rounded-[6px] bg-background hairline">
              <img
                src={persona.image}
                alt={persona.name}
                className="h-full w-full object-contain"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">{persona.name}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {persona.tagline}
              </p>
            </div>
          </div>

          <div>
            <p className="eyebrow">Personas</p>
            <div className="mt-3 grid max-h-80 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
              {AVATAR_PRESETS.map((p) => {
                const active = seed === p.seed;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSeed(p.seed)}
                    className={cn(
                      "group flex flex-col items-center gap-1 rounded-[6px] p-2 text-[10px] uppercase tracking-[0.1em] transition-all hairline",
                      active
                        ? "border-foreground bg-foreground text-background scale-[1.02]"
                        : "bg-background hover:bg-muted hover:-translate-y-0.5",
                    )}
                    aria-pressed={active}
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-16 w-16 rounded-[4px] object-contain transition-transform group-hover:scale-105"
                      style={{ imageRendering: "pixelated" }}
                    />
                    <span className="truncate">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save avatar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
