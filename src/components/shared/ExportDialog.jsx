import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "./Button";
import { useExport } from "@/hooks/useExport";
import { useBootxamp } from "@/hooks/useBootxamp";
import { getCurrentDay, getCurrentWeek } from "@/lib/bootxamp/selectors";
import { DEPARTMENTS } from "@/constants/departments";

/**
 * @param {{ open: boolean, onOpenChange: (v:boolean)=>void }} props
 */
export function ExportDialog({ open, onOpenChange }) {
  const { data } = useBootxamp();
  const { exportDaily, exportWeekly, exportDepartment, exportCareer } = useExport();
  const day = getCurrentDay(data);
  const week = getCurrentWeek(data);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-[6px] border-border bg-surface p-0">
        <DialogHeader className="p-6 pb-4 hairline-b">
          <DialogTitle className="font-display text-2xl font-medium tracking-tight">Export</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Download a JSON copy of your data.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 p-6">
          <Row
            label="Today"
            hint={day ? `Day ${day.dayNumber} · ${day.theme || "—"}` : "No day available"}
            onClick={() => day && exportDaily(day.id)}
            disabled={!day}
          />
          <Row
            label="Current week"
            hint={week ? `Week ${week.weekNumber} · ${week.days.length} days` : "No week available"}
            onClick={() => week && exportWeekly(week.id)}
            disabled={!week}
          />
          <div className="hairline rounded-[6px] p-4">
            <p className="eyebrow mb-3">Department</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DEPARTMENTS.map((d) => (
                <Button key={d.id} variant="outline" size="sm" onClick={() => exportDepartment(d.id)}>
                  {d.name}
                </Button>
              ))}
            </div>
          </div>
          <Row label="Entire career" hint="Full BootXampData snapshot" onClick={exportCareer} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, hint, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-between gap-4 hairline rounded-[6px] bg-background px-4 py-3 text-left transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{hint}</p>
      </div>
      <span className="eyebrow shrink-0">JSON</span>
    </button>
  );
}
