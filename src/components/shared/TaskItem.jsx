import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMinutes } from "@/utils/format";
import { Badge } from "./Badge";

/**
 * @param {{
 *   task: import("@/lib/bootxamp/schema").Task,
 *   locked: boolean,
 *   onToggle: () => void,
 *   onEvidence: (v: string) => void,
 * }} props
 */
export function TaskItem({ task, locked, onToggle, onEvidence }) {
  const [evidence, setEvidence] = useState(task.evidence ?? "");

  return (
    <div
      className={cn(
        "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-4 py-4",
        task.completed && "opacity-70",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={locked}
        aria-pressed={task.completed}
        aria-label={task.completed ? "Mark task incomplete" : "Complete task"}
        className={cn(
          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-[4px] transition-colors",
          task.completed
            ? "border border-foreground bg-foreground text-background"
            : "hairline bg-surface hover:bg-muted",
          locked && "cursor-not-allowed",
        )}
      >
        {task.completed ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : null}
      </button>

      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p
            className={cn(
              "font-medium",
              task.completed && "line-through decoration-1 underline-offset-4",
            )}
          >
            {task.title}
          </p>
          {task.difficulty ? (
            <Badge variant="outline">{task.difficulty}</Badge>
          ) : null}
          {task.priority && task.priority !== "medium" ? (
            <Badge>{task.priority}</Badge>
          ) : null}
        </div>
        {task.description ? (
          <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
        ) : null}
        <div className="mt-2">
          <input
            type="url"
            value={evidence}
            placeholder="Evidence link (optional)"
            disabled={locked}
            onChange={(e) => setEvidence(e.target.value)}
            onBlur={() => onEvidence(evidence)}
            className="w-full max-w-md rounded-[4px] bg-transparent px-0 py-1 text-xs text-muted-foreground outline-none hairline-b focus:text-foreground disabled:cursor-not-allowed"
          />
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 text-right meta shrink-0">
        <span className="tabular-nums">{formatMinutes(task.estimatedTime)}</span>
        {task.xp ? <span className="tabular-nums">{task.xp} XP</span> : null}
      </div>
    </div>
  );
}
