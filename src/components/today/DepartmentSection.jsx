import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskItem } from "@/components/shared/TaskItem";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatMinutes } from "@/utils/format";

/**
 * @param {{
 *   department: import("@/lib/bootxamp/schema").Department,
 *   dept: { id: string, name: string, icon: any, strokeVar: string },
 *   locked: boolean,
 *   onToggleTask: (taskId: string) => void,
 *   onEvidence: (taskId: string, evidence: string) => void,
 *   defaultOpen?: boolean,
 * }} props
 */
export function DepartmentSection({ department, dept, locked, onToggleTask, onEvidence, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const total = department.tasks.length;
  const done = department.tasks.filter((t) => t.completed).length;
  const totalMin = department.tasks.reduce((n, t) => n + (t.estimatedTime || 0), 0);
  const Icon = dept.icon;

  return (
    <section className="hairline rounded-[6px] bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="grid h-8 w-8 place-items-center rounded-[4px] hairline">
            <Icon className="h-4 w-4" strokeWidth={1.5} style={{ color: dept.strokeVar }} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{dept.name}</p>
            <p className="text-xs text-muted-foreground">
              {total > 0 ? `${done} of ${total} · ${formatMinutes(totalMin)}` : "No tasks assigned"}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
          strokeWidth={1.5}
        />
      </button>
      {open ? (
        <div className="hairline-t px-5">
          {total === 0 ? (
            <div className="py-6">
              <EmptyState compact title={`No ${dept.name} tasks.`} description="Import a day with tasks in this department." />
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {department.tasks.map((t) => (
                <li key={t.id}>
                  <TaskItem
                    task={t}
                    locked={locked}
                    onToggle={() => onToggleTask(t.id)}
                    onEvidence={(v) => onEvidence(t.id, v)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </section>
  );
}
