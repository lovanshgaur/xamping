import { useCallback, useSyncExternalStore } from "react";
import { loadEnvelope, saveEnvelope, subscribe, notify } from "@/lib/bootxamp/services/storage.service";
import { nowIso } from "@/utils/dates";

let cachedEnvelope = null;

function getSnapshot() {
  if (!cachedEnvelope) cachedEnvelope = loadEnvelope();
  return cachedEnvelope;
}

function getServerSnapshot() {
  // SSR: hand back a fresh empty envelope. First client mount reconciles.
  if (!cachedEnvelope) cachedEnvelope = loadEnvelope();
  return cachedEnvelope;
}

/**
 * Central hook. All React code reads BootXampData through this.
 * `mutate(recipe)` receives a mutable draft; return value is ignored.
 * The store deep-clones before mutation so React sees a new reference.
 */
export function useBootxamp() {
  const envelope = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const mutate = useCallback((recipe) => {
    const current = cachedEnvelope ?? loadEnvelope();
    const draft = structuredClone(current);
    recipe(draft.data);
    draft.data.app.lastUpdated = nowIso();
    cachedEnvelope = draft;
    saveEnvelope(draft);
    notify();
  }, []);

  return { envelope, data: envelope.data, mutate };
}
