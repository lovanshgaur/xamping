import { BookOpen, Hammer, Sprout, Briefcase, Activity } from "lucide-react";

/**
 * @typedef {"learn" | "build" | "grow" | "career" | "operate"} DepartmentId
 */

/**
 * The five departments of BootXamp. Order is authoritative and matches
 * the specification. Never mutate this array; consumers read it as-is.
 */
export const DEPARTMENTS = Object.freeze([
  {
    id: "learn",
    name: "Learn",
    description: "Study, courses, notes, and structured practice.",
    icon: BookOpen,
    tokenClass: "text-dept-learn",
    bgClass: "bg-dept-learn",
    strokeVar: "var(--color-dept-learn)",
  },
  {
    id: "build",
    name: "Build",
    description: "Projects, features, commits, and shipping.",
    icon: Hammer,
    tokenClass: "text-dept-build",
    bgClass: "bg-dept-build",
    strokeVar: "var(--color-dept-build)",
  },
  {
    id: "grow",
    name: "Grow",
    description: "Reading, writing, communication, consistency.",
    icon: Sprout,
    tokenClass: "text-dept-grow",
    bgClass: "bg-dept-grow",
    strokeVar: "var(--color-dept-grow)",
  },
  {
    id: "career",
    name: "Career",
    description: "Applications, networking, interviews, portfolio.",
    icon: Briefcase,
    tokenClass: "text-dept-career",
    bgClass: "bg-dept-career",
    strokeVar: "var(--color-dept-career)",
  },
  {
    id: "operate",
    name: "Operate",
    description: "Sleep, exercise, energy, focus, health.",
    icon: Activity,
    tokenClass: "text-dept-operate",
    bgClass: "bg-dept-operate",
    strokeVar: "var(--color-dept-operate)",
  },
]);

export const DEPARTMENT_IDS = Object.freeze(DEPARTMENTS.map((d) => d.id));

/** @param {string} id */
export function getDepartment(id) {
  return DEPARTMENTS.find((d) => d.id === id) ?? null;
}
