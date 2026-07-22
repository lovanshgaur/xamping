import { nanoid } from "nanoid";
import { importSchemas, detectImportKind } from "../schema";
import { normalizeDay, normalizeSprint, normalizeWeek } from "../store";
import { appendTimeline, TIMELINE_EVENTS } from "../io";
import { nowIso } from "@/utils/dates";
import { flattenZodError } from "@/utils/validation";

/**
 * Parse + validate JSON text.
 * @param {string} text
 * @returns {{ ok: boolean, kind?: string, payload?: any, errors?: {path:string,message:string}[] }}
 */
export function parseImport(text) {
  let raw;
  try {
    raw = JSON.parse(text);
  } catch (err) {
    return { ok: false, errors: [{ path: "", message: "Invalid JSON: " + err.message }] };
  }

  const kind = detectImportKind(raw);
  if (kind === "unknown") {
    return {
      ok: false,
      errors: [{ path: "", message: "Unrecognized shape. Expected sprint, week, day, or review." }],
    };
  }

  const schema = importSchemas[kind];
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, kind, errors: flattenZodError(parsed.error) };
  }
  return { ok: true, kind, payload: parsed.data };
}

/**
 * Build a human-readable diff preview.
 * @param {import("../schema").BootXampData} data
 * @param {string} kind
 * @param {any} payload
 */
export function previewImport(data, kind, payload) {
  if (kind === "sprint") {
    return [
      { label: "Sprint", value: payload.title },
      { label: "Weeks", value: payload.weeks?.length ?? 0 },
      { label: "Replaces", value: data.sprint ? data.sprint.title : "—" },
    ];
  }
  if (kind === "week") {
    const existing = data.weeks.find((w) => w.weekNumber === payload.weekNumber);
    return [
      { label: "Week", value: `Week ${payload.weekNumber} — ${payload.title || "—"}` },
      { label: "Days", value: payload.days.length },
      { label: "Replaces", value: existing ? `Existing week ${existing.weekNumber}` : "New" },
    ];
  }
  if (kind === "day") {
    const week = findWeekForDay(data, payload.dayNumber);
    return [
      { label: "Day", value: `Day ${payload.dayNumber} — ${payload.theme || "—"}` },
      { label: "Tasks", value: payload.departments.reduce((n, d) => n + d.tasks.length, 0) },
      { label: "Attaches to", value: week ? `Week ${week.weekNumber}` : "New week" },
    ];
  }
  if (kind === "review") {
    return [
      { label: "Review for", value: payload.dayId },
      { label: "Rating", value: payload.overallRating },
    ];
  }
  if (kind === "personal") {
    return [
      { label: "Name", value: payload.name ?? data.employee.name ?? "—" },
      { label: "Birthday", value: payload.birthday ?? data.employee.birthday ?? "—" },
      { label: "Avatar seed", value: payload.avatar?.seed ?? "—" },
      { label: "Fields", value: Object.keys(payload).filter((k) => k !== "kind").join(", ") },
    ];
  }
  return [];
}


/**
 * Apply a validated payload into a mutable draft. Records an ImportRecord and
 * appends a typed timeline event.
 * @param {import("../schema").BootXampData} data
 * @param {string} kind
 * @param {any} payload
 * @param {string} fileName
 */
export function applyImport(data, kind, payload, fileName) {
  if (kind === "sprint") applySprint(data, payload);
  else if (kind === "week") applyWeek(data, payload);
  else if (kind === "day") applyDay(data, payload);
  else if (kind === "review") applyReview(data, payload);
  else if (kind === "personal") applyPersonal(data, payload);

  const record = {
    id: nanoid(),
    fileName,
    importedAt: nowIso(),
    version: 1,
    success: true,
    kind,
    metadata: {},
  };
  data.imports.push(record);
  data.history.imports.push(record);

  const eventType =
    kind === "sprint"
      ? TIMELINE_EVENTS.SPRINT_IMPORTED
      : kind === "week"
        ? TIMELINE_EVENTS.WEEK_IMPORTED
        : kind === "day"
          ? TIMELINE_EVENTS.DAY_IMPORTED
          : kind === "personal"
            ? TIMELINE_EVENTS.PROFILE_UPDATED
            : TIMELINE_EVENTS.REVIEW_SUBMITTED;

  appendTimeline(data, {
    type: eventType,
    title: `${labelForKind(kind)} imported`,
    description: fileName,
    metadata: { kind, fileName },
  });
}

function applyPersonal(data, payload) {
  const e = data.employee;
  if (payload.name != null) e.name = payload.name;
  if (payload.designation != null) e.designation = payload.designation;
  if (payload.company != null) e.company = payload.company;
  if (payload.birthday !== undefined) e.birthday = payload.birthday;
  if (payload.height !== undefined) e.height = payload.height;
  if (payload.weight !== undefined) e.weight = payload.weight;
  if (payload.bio != null) {
    e.metadata = e.metadata ?? {};
    e.metadata.bio = payload.bio;
  }
  if (payload.socials) {
    e.metadata = e.metadata ?? {};
    e.metadata.socials = { ...(e.metadata.socials ?? {}), ...payload.socials };
  }
  if (payload.avatar?.seed) {
    e.avatar = { style: payload.avatar.style || e.avatar?.style || "adventurer", seed: payload.avatar.seed };
  }
  e.updatedAt = nowIso();
}


/** @param {string} kind */
function labelForKind(kind) {
  return kind[0].toUpperCase() + kind.slice(1);
}

function applySprint(data, payload) {
  const sprint = normalizeSprint(payload);
  data.sprint = sprint;
  data.app.currentSprintId = sprint.id;
  if (Array.isArray(payload.weeks)) {
    data.weeks = payload.weeks.map(normalizeWeek);
    const firstWeek = data.weeks[0];
    if (firstWeek) {
      data.app.currentWeekId = firstWeek.id;
      const firstDay = firstWeek.days[0];
      if (firstDay) data.app.currentDayId = firstDay.id;
    }
  }
  data.app.lastUpdated = nowIso();
}

function applyWeek(data, payload) {
  const week = normalizeWeek(payload);
  const idx = data.weeks.findIndex((w) => w.weekNumber === week.weekNumber);
  if (idx >= 0) data.weeks[idx] = week;
  else data.weeks.push(week);
  data.weeks.sort((a, b) => a.weekNumber - b.weekNumber);
  if (!data.app.currentWeekId) data.app.currentWeekId = week.id;
  if (!data.app.currentDayId && week.days[0]) data.app.currentDayId = week.days[0].id;
  data.app.lastUpdated = nowIso();
}

function applyDay(data, payload) {
  const day = normalizeDay(payload);
  const week = findWeekForDay(data, day.dayNumber);
  if (!week) {
    // Create a stub week if none exists.
    const weekNumber = Math.max(1, Math.ceil(day.dayNumber / 7));
    const newWeek = normalizeWeek({ weekNumber, days: [day] });
    data.weeks.push(newWeek);
    data.weeks.sort((a, b) => a.weekNumber - b.weekNumber);
    if (!data.app.currentWeekId) data.app.currentWeekId = newWeek.id;
    if (!data.app.currentDayId) data.app.currentDayId = day.id;
  } else {
    const idx = week.days.findIndex((d) => d.dayNumber === day.dayNumber);
    if (idx >= 0) week.days[idx] = day;
    else week.days.push(day);
    week.days.sort((a, b) => a.dayNumber - b.dayNumber);
    if (!data.app.currentDayId) data.app.currentDayId = day.id;
  }
  data.app.lastUpdated = nowIso();
}

function applyReview(data, payload) {
  for (const week of data.weeks) {
    const day = week.days.find((d) => d.id === payload.dayId);
    if (day) {
      day.review = {
        id: nanoid(),
        strengths: payload.strengths ?? [],
        weaknesses: payload.weaknesses ?? [],
        blockers: payload.blockers ?? [],
        managerRemarks: payload.managerRemarks ?? "",
        employeeReflection: payload.employeeReflection ?? "",
        overallRating: payload.overallRating ?? 0,
        submittedAt: nowIso(),
        createdAt: nowIso(),
        updatedAt: nowIso(),
        metadata: {},
      };
      data.employee.totalReviews += 1;
      break;
    }
  }
}

function findWeekForDay(data, dayNumber) {
  for (const w of data.weeks) {
    if (w.days.some((d) => d.dayNumber === dayNumber)) return w;
  }
  return null;
}
