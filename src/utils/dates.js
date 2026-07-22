/** ISO timestamp for `createdAt` / `updatedAt`. */
export function nowIso() {
  return new Date().toISOString();
}

/** Local YYYY-MM-DD for `Day.date`. */
export function todayISODate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** @param {string | undefined | null} iso */
export function formatDateLong(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** @param {string | undefined | null} iso */
export function formatDateShort(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/** @param {string | undefined | null} iso */
export function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** @param {string} isoA @param {string} isoB */
export function daysBetween(isoA, isoB) {
  const a = new Date(isoA);
  const b = new Date(isoB);
  const ms = Math.abs(b.getTime() - a.getTime());
  return Math.round(ms / 86_400_000);
}
