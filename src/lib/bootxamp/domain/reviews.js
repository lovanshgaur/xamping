import { nanoid } from "nanoid";
import { nowIso } from "@/utils/dates";

/**
 * Build a blank review shell with generated metadata fields.
 * @returns {import("../schema").Review}
 */
export function blankReview() {
  const now = nowIso();
  return {
    id: nanoid(),
    strengths: [],
    weaknesses: [],
    blockers: [],
    managerRemarks: "",
    employeeReflection: "",
    overallRating: 0,
    submittedAt: null,
    createdAt: now,
    updatedAt: now,
    metadata: {},
  };
}

/** @param {number} n */
export function normalizeRating(n) {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, Math.round(n * 2) / 2));
}
