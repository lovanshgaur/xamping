import { nanoid } from "nanoid";
import { appendTimeline, TIMELINE_EVENTS } from "../io";
import { nowIso } from "@/utils/dates";

/**
 * Build a JSON payload + filename for a given export scope.
 * Also records an ExportRecord and a typed timeline event in the mutable
 * draft passed in.
 *
 * @param {import("../schema").BootXampData} data
 * @param {"daily"|"weekly"|"department"|"career"|"backup"} type
 * @param {{ dayId?: string, weekId?: string, deptSlug?: import("../schema").DepartmentId }} [scope]
 * @returns {{ filename: string, contents: string } | null}
 */
export function serializeExport(data, type, scope = {}) {
  let payload = null;
  let filename = "";

  if (type === "daily") {
    const day = findDay(data, scope.dayId);
    if (!day) return null;
    payload = day;
    filename = `bootxamp-day-${day.dayNumber}-${day.date}.json`;
  } else if (type === "weekly") {
    const week = data.weeks.find((w) => w.id === scope.weekId);
    if (!week) return null;
    payload = week;
    filename = `bootxamp-week-${week.weekNumber}.json`;
  } else if (type === "department") {
    if (!scope.deptSlug) return null;
    payload = collectDepartment(data, scope.deptSlug);
    filename = `bootxamp-${scope.deptSlug}.json`;
  } else if (type === "career" || type === "backup") {
    payload = data;
    filename =
      type === "backup"
        ? `bootxamp-backup-${dateStamp()}.json`
        : `bootxamp-career-${dateStamp()}.json`;
  }

  if (payload === null) return null;
  const contents = JSON.stringify({ exportedAt: nowIso(), type, payload }, null, 2);

  const record = {
    id: nanoid(),
    exportedAt: nowIso(),
    type,
    version: 1,
    metadata: { filename },
  };
  data.exports.push(record);
  data.history.exports.push(record);
  appendTimeline(data, {
    type: type === "backup" ? TIMELINE_EVENTS.BACKUP_CREATED : TIMELINE_EVENTS.EXPORT_CREATED,
    title: type === "backup" ? "Backup created" : `${labelFor(type)} export`,
    description: filename,
    metadata: { type, filename },
  });

  return { filename, contents };
}

function labelFor(type) {
  return type[0].toUpperCase() + type.slice(1);
}

function dateStamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function findDay(data, dayId) {
  for (const w of data.weeks) {
    const d = w.days.find((x) => x.id === dayId);
    if (d) return d;
  }
  return null;
}

function collectDepartment(data, slug) {
  const tasks = [];
  const days = [];
  for (const w of data.weeks) {
    for (const d of w.days) {
      const dept = d.departments.find((x) => x.slug === slug);
      if (dept && dept.tasks.length > 0) {
        days.push({ dayNumber: d.dayNumber, date: d.date, tasks: dept.tasks });
        for (const t of dept.tasks) tasks.push(t);
      }
    }
  }
  return { slug, tasks, days };
}
