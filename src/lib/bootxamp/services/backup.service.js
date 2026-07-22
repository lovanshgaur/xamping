import { serializeExport } from "./export.service";
import { clearStorage } from "./storage.service";
import { downloadText } from "@/utils/download";

/**
 * Forced backup → wipe → reload. Called by the Reset flow.
 * @param {import("../schema").BootXampData} data
 */
export function backupAndReset(data) {
  const result = serializeExport(data, "backup");
  if (result) downloadText(result.filename, result.contents);
  clearStorage();
  if (typeof window !== "undefined") window.location.reload();
}
