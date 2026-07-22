import { useCallback, useState } from "react";
import { parseImport, previewImport, applyImport } from "@/lib/bootxamp/services/import.service";
import { useBootxamp } from "./useBootxamp";

/**
 * Import dialog controller. Parses + validates a file, exposes a preview,
 * and applies the payload on confirmation.
 */
export function useImport() {
  const { data, mutate } = useBootxamp();
  const [state, setState] = useState({ status: "idle", errors: [], kind: null, payload: null, fileName: "" });

  const loadFile = useCallback(
    async (file) => {
      const text = await file.text();
      const parsed = parseImport(text);
      if (!parsed.ok) {
        setState({ status: "error", errors: parsed.errors, kind: parsed.kind ?? null, payload: null, fileName: file.name });
        return;
      }
      setState({
        status: "preview",
        errors: [],
        kind: parsed.kind,
        payload: parsed.payload,
        fileName: file.name,
      });
    },
    [],
  );

  const preview = state.payload ? previewImport(data, state.kind, state.payload) : [];

  const apply = useCallback(() => {
    if (state.status !== "preview" || !state.kind || !state.payload) return;
    mutate((d) => applyImport(d, state.kind, state.payload, state.fileName));
    setState({ status: "success", errors: [], kind: null, payload: null, fileName: "" });
  }, [mutate, state]);

  const reset = useCallback(() => {
    setState({ status: "idle", errors: [], kind: null, payload: null, fileName: "" });
  }, []);

  return { state, preview, loadFile, apply, reset };
}
