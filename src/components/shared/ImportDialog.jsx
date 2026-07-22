import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "./Button";
import { useImport } from "@/hooks/useImport";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";

/**
 * @param {{ open: boolean, onOpenChange: (v:boolean)=>void }} props
 */
export function ImportDialog({ open, onOpenChange }) {
  const inputRef = useRef(null);
  const { state, preview, loadFile, apply, reset } = useImport();
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    loadFile(files[0]);
  };

  const close = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : close())}>
      <DialogContent className="max-w-xl rounded-[6px] border-border bg-surface p-0">
        <DialogHeader className="p-6 pb-4 hairline-b">
          <DialogTitle className="font-display text-2xl font-medium tracking-tight">
            Import JSON
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Sprint, week, day, or review. The file is validated before applying.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {state.status === "idle" || state.status === "error" ? (
            <>
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFiles(e.dataTransfer.files);
                }}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[6px] p-10 text-center transition-colors hairline",
                  dragOver ? "bg-muted" : "bg-background hover:bg-muted",
                )}
              >
                <UploadCloud className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium">Drop a JSON file here</p>
                  <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </label>

              {state.status === "error" ? (
                <div className="mt-4 hairline rounded-[6px] bg-background p-4">
                  <p className="text-xs font-medium text-destructive">Validation failed</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {state.errors.map((err, i) => (
                      <li key={i}>
                        <span className="text-foreground">{err.path || "root"}</span> — {err.message}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : null}

          {state.status === "preview" ? (
            <div className="space-y-4">
              <div className="hairline rounded-[6px] bg-background p-4">
                <p className="eyebrow">{state.kind} · {state.fileName}</p>
                <dl className="mt-3 space-y-2">
                  {preview.map((p, i) => (
                    <div key={i} className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 text-sm">
                      <dt className="text-muted-foreground">{p.label}</dt>
                      <dd className="truncate font-medium">{String(p.value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={reset}>Cancel</Button>
                <Button onClick={apply}>Apply import</Button>
              </div>
            </div>
          ) : null}

          {state.status === "success" ? (
            <div className="text-center">
              <p className="font-display text-xl">Imported.</p>
              <div className="mt-4 flex justify-center gap-2">
                <Button variant="ghost" onClick={reset}>Import another</Button>
                <Button onClick={close}>Done</Button>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
