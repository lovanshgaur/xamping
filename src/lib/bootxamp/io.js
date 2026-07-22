import { nanoid } from "nanoid";
import { nowIso } from "@/utils/dates";

/**
 * Append an immutable typed event to `history.timeline`.
 * Mutates `data` in place — callers pass a mutable draft.
 *
 * @param {import("./schema").BootXampData} data
 * @param {{ type: string, title: string, description?: string, metadata?: Record<string, any> }} event
 */
export function appendTimeline(data, event) {
  const item = {
    id: nanoid(),
    type: event.type,
    title: event.title,
    description: event.description ?? "",
    timestamp: nowIso(),
    metadata: event.metadata ?? {},
  };
  data.history.timeline.push(item);
  data.history.activity.push(item);
  return item;
}

/** Immutable event types. Never rename an existing value — only add new ones. */
export const TIMELINE_EVENTS = Object.freeze({
  SPRINT_IMPORTED: "SPRINT_IMPORTED",
  WEEK_IMPORTED: "WEEK_IMPORTED",
  DAY_IMPORTED: "DAY_IMPORTED",
  MISSION_STARTED: "MISSION_STARTED",
  TASK_COMPLETED: "TASK_COMPLETED",
  TASK_UNCHECKED: "TASK_UNCHECKED",
  DAY_SUBMITTED: "DAY_SUBMITTED",
  REVIEW_SUBMITTED: "REVIEW_SUBMITTED",
  PROMOTION_EARNED: "PROMOTION_EARNED",
  EXPORT_CREATED: "EXPORT_CREATED",
  BACKUP_CREATED: "BACKUP_CREATED",
  APPLICATION_ADDED: "APPLICATION_ADDED",
  COMMIT_ADDED: "COMMIT_ADDED",
  ACHIEVEMENT_UNLOCKED: "ACHIEVEMENT_UNLOCKED",
  OPERATE_LOGGED: "OPERATE_LOGGED",
  MANAGER_REVIEW: "MANAGER_REVIEW",
  PROFILE_UPDATED: "PROFILE_UPDATED",
});
