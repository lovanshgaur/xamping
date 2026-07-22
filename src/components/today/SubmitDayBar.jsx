import { useState } from "react";
import { Button } from "@/components/shared/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

/**
 * @param {{ onSubmit: (reflection: string) => void, disabled: boolean, dayLabel: string }} props
 */
export function SubmitDayBar({ onSubmit, disabled, dayLabel }) {
  const [open, setOpen] = useState(false);
  const [reflection, setReflection] = useState("");

  const confirm = () => {
    onSubmit(reflection);
    setOpen(false);
    setReflection("");
  };

  return (
    <>
      <div className="sticky bottom-0 z-20 mt-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-[6px] bg-surface p-4 hairline">
        <div className="min-w-0">
          <p className="eyebrow">Submit Day</p>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            Once submitted, {dayLabel} becomes read-only forever.
          </p>
        </div>
        <Button onClick={() => setOpen(true)} disabled={disabled}>
          <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
          Submit
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-[6px] border-border bg-surface">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-medium tracking-tight">
              Reflect and submit
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              A brief employee reflection is attached to the day’s review. History is immutable after this.
            </DialogDescription>
          </DialogHeader>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={5}
            placeholder="What went well. What blocked you. What tomorrow needs."
            className="w-full resize-none rounded-[6px] bg-background p-3 text-sm outline-none hairline focus:border-foreground"
          />
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={confirm}>Submit day</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
