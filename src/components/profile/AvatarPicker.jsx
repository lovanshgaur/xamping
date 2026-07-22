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
import { AVATAR_PRESETS, AVATAR_STYLE } from "@/constants/avatars";
import { buildAvatarUrl, normalizeAvatar } from "@/lib/bootxamp/domain/avatar";
import { cn } from "@/lib/utils";

/**
 * Pop-culture avatar picker: twelve curated characters, one style.
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

  const previewUrl = buildAvatarUrl({ seed, size: 200 });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[6px] border-border bg-surface">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-medium tracking-tight">
            Choose your character
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Twelve curated personas. Pick one — it persists across every screen.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-[180px_minmax(0,1fr)]">
          <div className="flex flex-col items-center gap-3">
            <div className="grid h-44 w-44 place-items-center overflow-hidden rounded-[6px] bg-background hairline">
              <img src={previewUrl} alt="Selected avatar" className="h-full w-full object-cover" />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {AVATAR_PRESETS.find((p) => p.seed === seed)?.name ?? "Custom"}
            </p>
          </div>

          <div>
            <p className="eyebrow">Personas</p>
            <div className="mt-3 grid max-h-80 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
              {AVATAR_PRESETS.map((p) => {
                const url = buildAvatarUrl({ seed: p.seed, size: 96 });
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
                      src={url}
                      alt={p.name}
                      className="h-16 w-16 rounded-[4px] object-cover transition-transform group-hover:scale-105"
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
