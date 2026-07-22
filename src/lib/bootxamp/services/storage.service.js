import { STORAGE_KEY, ENVELOPE_VERSION, SCHEMA_VERSION } from "@/config/storage";
import { envelopeSchema } from "../schema";
import { createEmptyData, hydrateData, syncManagerToRank } from "../store";
import { isBrowser } from "@/utils/storage";
import { nowIso } from "@/utils/dates";

/**
 * Read + parse + migrate the envelope from localStorage. Returns a fresh
 * empty envelope if nothing is stored or if stored data is unreadable.
 * @returns {import("../schema").Envelope}
 */
export function loadEnvelope() {
  if (!isBrowser()) return createEmptyEnvelope();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyEnvelope();
    const parsed = JSON.parse(raw);
    const validated = envelopeSchema.parse(parsed);
    return migrate(validated);
  } catch {
    return createEmptyEnvelope();
  }
}

/** @param {import("../schema").Envelope} envelope */
export function saveEnvelope(envelope) {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(envelope));
}

export function clearStorage() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
}

/** @returns {import("../schema").Envelope} */
export function createEmptyEnvelope() {
  return {
    version: ENVELOPE_VERSION,
    schema: SCHEMA_VERSION,
    data: createEmptyData(),
  };
}

/**
 * Placeholder migration pipeline. Future schema bumps register a step here.
 * @param {import("../schema").Envelope} envelope
 */
function migrate(envelope) {
  let current = envelope;
  if (current.schema < SCHEMA_VERSION) {
    current = { ...current, schema: SCHEMA_VERSION };
  }
  // Hydrate against the current empty-data shape so newly added fields
  // (operate history, employee bio, avatar object, manager tier, ...)
  // are present even when the envelope was written by an older build.
  current = { ...current, data: hydrateData(current.data) };
  syncManagerToRank(current.data);
  current.data.app.lastOpened = nowIso();
  return current;
}

/* ---------------------- Cross-tab notification helpers ---------------------- */

const listeners = new Set();

/** @param {() => void} fn */
export function subscribe(fn) {
  listeners.add(fn);
  if (isBrowser()) window.addEventListener("storage", handleStorageEvent);
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0 && isBrowser()) {
      window.removeEventListener("storage", handleStorageEvent);
    }
  };
}

export function notify() {
  for (const fn of listeners) fn();
}

/** @param {StorageEvent} event */
function handleStorageEvent(event) {
  if (event.key !== STORAGE_KEY) return;
  for (const fn of listeners) fn();
}
