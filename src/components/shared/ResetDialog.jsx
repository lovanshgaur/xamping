import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "./Button";

/**
 * @param {{ open:boolean, onOpenChange:(v:boolean)=>void, onConfirm:()=>void }} props
 */
export function ResetDialog({ open, onOpenChange, onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-[6px] border-border bg-surface">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-medium tracking-tight">Reset BootXamp</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            A full backup will download automatically, then all local data will be wiped.
            History is destroyed. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2 gap-2 sm:justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Backup & reset</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
