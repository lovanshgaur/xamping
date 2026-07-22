/** @param {number | null | undefined} n */
export function formatNumber(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat().format(n);
}

/** @param {number | null | undefined} minutes */
export function formatMinutes(minutes) {
  if (!minutes) return "—";
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** @param {number | null | undefined} hours */
export function formatHours(hours) {
  if (hours === null || hours === undefined) return "—";
  return `${hours.toFixed(1)}h`;
}

/** @param {number | null | undefined} n */
export function formatPercent(n) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return `${Math.round(n * 100)}%`;
}

/** @param {number} bytes */
export function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i += 1;
  }
  return `${n.toFixed(n < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

/** Guarantees a fixed-width numeric fallback for empty numbers. */
export function orDash(v) {
  return v === null || v === undefined || v === "" ? "—" : v;
}
