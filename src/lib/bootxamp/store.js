import { nanoid } from "nanoid";
import { DEPARTMENTS, DEPARTMENT_IDS } from "@/constants/departments";
import { APP } from "@/config/app";
import { nowIso } from "@/utils/dates";
import { normalizeAvatar } from "./domain/avatar";
import { getManagerForRank, MANAGER_TIERS } from "@/constants/managers";
import { emptyOperateMetrics } from "@/constants/operate";

/**
 * Factory for a structurally-complete empty BootXampData.
 * @returns {import("./schema").BootXampData}
 */
export function createEmptyData() {
  const now = nowIso();
  const startingManager = getManagerForRank("apprentice");
  return {
    app: {
      version: APP.version,
      build: APP.build,
      createdAt: now,
      lastOpened: now,
      lastUpdated: now,
      currentSprintId: null,
      currentWeekId: null,
      currentDayId: null,
    },
    employee: {
      id: nanoid(),
      name: "",
      avatar: { style: "notionists-neutral", seed: "bootxamp" },
      designation: "",
      company: "",
      joinDate: null,
      birthday: null,
      height: null,
      weight: null,
      weightHistory: [],
      overallXP: 0,
      overallLevel: 1,
      overallRank: "apprentice",
      currentStreak: 0,
      longestStreak: 0,
      totalHours: 0,
      totalTasksCompleted: 0,
      totalProjectsCompleted: 0,
      totalApplications: 0,
      totalCommits: 0,
      totalReviews: 0,
      totalBonusXP: 0,
      totalPenaltyXP: 0,
      promotionHistory: [],
      createdAt: now,
      updatedAt: now,
      metadata: {},
    },
    manager: {
      id: nanoid(),
      name: startingManager.name,
      position: startingManager.position,
      level: startingManager.level,
      company: startingManager.company,
      avatar: { style: startingManager.avatarStyle, seed: startingManager.avatarSeed },
      rankId: startingManager.rankId,
      bio: startingManager.bio,
      designation: startingManager.position,
      currentTheme: "",
      currentMission: "",
      announcements: [],
      notes: [],
      createdAt: now,
      updatedAt: now,
      metadata: {},
    },
    sprint: null,
    weeks: [],
    achievements: [],
    operate: {
      /** @type {Record<string, {date:string, metrics:Record<string,number>, scores:any, updatedAt:string}>} */
      byDate: {},
    },
    reviews: {
      /** daily reviews keyed by dayId */
      daily: {},
      /** weekly reviews keyed by weekId */
      weekly: {},
    },
    analytics: {
      codingHours: [],
      studyHours: [],
      readingHours: [],
      exerciseHours: [],
      sleepHours: [],
      calories: [],
      heartPoints: [],
      steps: [],
      distance: [],
      timeMoving: [],
      weight: [],
      focus: [],
      energy: [],
      applications: [],
      commits: [],
      dailyReview: [],
      weeklyReview: [],
    },
    history: {
      timeline: [],
      activity: [],
      promotions: [],
      imports: [],
      exports: [],
    },
    notifications: [],
    settings: {
      theme: "system",
      palette: "editorial",
      accentColor: "orange",
      animations: true,
      reducedMotion: false,
      sidebarCollapsed: false,
      exportBeforeReset: true,
    },

    ui: {
      activePage: "/",
      selectedWeek: null,
      selectedDay: null,
      activeDepartment: null,
      sidebarOpen: true,
      modal: null,
    },
    imports: [],
    exports: [],
  };
}

/**
 * Fill missing fields on data loaded from an older envelope. Non-destructive.
 * @param {any} data
 * @returns {import("./schema").BootXampData}
 */
export function hydrateData(data) {
  const empty = createEmptyData();
  if (!data || typeof data !== "object") return empty;

  const employee = { ...empty.employee, ...(data.employee ?? {}) };
  employee.avatar = normalizeAvatar(employee.avatar);
  employee.weightHistory = Array.isArray(employee.weightHistory) ? employee.weightHistory : [];
  if (employee.totalBonusXP == null) employee.totalBonusXP = 0;
  if (employee.totalPenaltyXP == null) employee.totalPenaltyXP = 0;
  if (employee.birthday === undefined) employee.birthday = null;
  if (employee.height === undefined) employee.height = null;
  if (employee.weight === undefined) employee.weight = null;

  const managerTier = getManagerForRank(employee.overallRank || "apprentice");
  const manager = {
    ...empty.manager,
    ...(data.manager ?? {}),
  };
  if (!manager.avatar || typeof manager.avatar === "string") {
    manager.avatar = { style: managerTier.avatarStyle, seed: managerTier.avatarSeed };
  }
  if (!manager.rankId) manager.rankId = managerTier.rankId;
  if (!manager.position) manager.position = managerTier.position;
  if (!manager.level) manager.level = managerTier.level;
  if (!manager.bio) manager.bio = managerTier.bio;
  if (!manager.name) manager.name = managerTier.name;
  if (!manager.company) manager.company = managerTier.company;

  const analytics = { ...empty.analytics, ...(data.analytics ?? {}) };
  for (const key of Object.keys(empty.analytics)) {
    if (!Array.isArray(analytics[key])) analytics[key] = [];
  }

  return {
    ...empty,
    ...data,
    employee,
    manager,
    operate: data.operate && typeof data.operate === "object" ? { byDate: data.operate.byDate ?? {} } : empty.operate,
    reviews: data.reviews && typeof data.reviews === "object" ? { daily: data.reviews.daily ?? {}, weekly: data.reviews.weekly ?? {} } : empty.reviews,
    analytics,
    history: { ...empty.history, ...(data.history ?? {}) },
    settings: { ...empty.settings, ...(data.settings ?? {}) },
    ui: { ...empty.ui, ...(data.ui ?? {}) },
  };
}

/** Sync manager identity to the tier that matches the employee's rank. */
export function syncManagerToRank(data) {
  const tier = getManagerForRank(data.employee.overallRank || "apprentice");
  if (data.manager.rankId === tier.rankId) return false;
  data.manager.rankId = tier.rankId;
  data.manager.name = tier.name;
  data.manager.position = tier.position;
  data.manager.designation = tier.position;
  data.manager.level = tier.level;
  data.manager.company = tier.company;
  data.manager.bio = tier.bio;
  data.manager.avatar = { style: tier.avatarStyle, seed: tier.avatarSeed };
  data.manager.updatedAt = nowIso();
  return true;
}

/**
 * Normalize a Department imported by the manager to include full internal fields.
 * @param {any} d
 * @returns {import("./schema").Department}
 */
export function normalizeDepartment(d) {
  const meta = DEPARTMENTS.find((x) => x.id === d.slug);
  const now = nowIso();
  return {
    id: d.id ?? nanoid(),
    slug: d.slug,
    name: d.name ?? meta?.name ?? d.slug,
    description: d.description ?? meta?.description ?? "",
    xp: d.xp ?? 0,
    level: d.level ?? 1,
    progress: d.progress ?? 0,
    statistics: d.statistics ?? {},
    tasks: (d.tasks ?? []).map((t) => normalizeTask(t, d.slug)),
    createdAt: d.createdAt ?? now,
    updatedAt: d.updatedAt ?? now,
    metadata: d.metadata ?? {},
  };
}

/**
 * @param {any} t
 * @param {import("./schema").DepartmentId} deptId
 */
export function normalizeTask(t, deptId) {
  const now = nowIso();
  return {
    id: t.id ?? nanoid(),
    title: t.title,
    description: t.description ?? "",
    department: t.department ?? deptId,
    estimatedTime: t.estimatedTime ?? 0,
    priority: t.priority ?? "medium",
    difficulty: t.difficulty ?? "medium",
    xp: t.xp ?? 0,
    completed: t.completed ?? false,
    completedAt: t.completedAt ?? null,
    evidence: t.evidence ?? "",
    notes: t.notes ?? "",
    createdAt: t.createdAt ?? now,
    updatedAt: t.updatedAt ?? now,
    metadata: t.metadata ?? {},
  };
}

/**
 * Ensure every day has all five departments in canonical order.
 * @param {any} day
 */
export function normalizeDay(day) {
  const now = nowIso();
  const providedBySlug = new Map();
  for (const d of day.departments ?? []) providedBySlug.set(d.slug, d);

  const departments = DEPARTMENT_IDS.map((slug) => {
    const provided = providedBySlug.get(slug);
    if (provided) return normalizeDepartment(provided);
    const meta = DEPARTMENTS.find((x) => x.id === slug);
    return normalizeDepartment({
      slug,
      name: meta?.name ?? slug,
      description: meta?.description ?? "",
      tasks: [],
    });
  });

  return {
    id: day.id ?? nanoid(),
    dayNumber: day.dayNumber,
    date: day.date,
    theme: day.theme ?? "",
    mission: day.mission ?? "",
    managerBrief: day.managerBrief ?? "",
    estimatedHours: day.estimatedHours ?? 0,
    score: day.score ?? 0,
    progress: day.progress ?? 0,
    status: day.status ?? "upcoming",
    completed: day.completed ?? false,
    submitted: day.submitted ?? false,
    departments,
    review: day.review ?? null,
    createdAt: day.createdAt ?? now,
    updatedAt: day.updatedAt ?? now,
    metadata: day.metadata ?? {},
  };
}

/** @param {any} week */
export function normalizeWeek(week) {
  const now = nowIso();
  return {
    id: week.id ?? nanoid(),
    weekNumber: week.weekNumber,
    title: week.title ?? "",
    objective: week.objective ?? "",
    theme: week.theme ?? "",
    progress: week.progress ?? 0,
    completed: week.completed ?? false,
    totalXP: week.totalXP ?? 0,
    review: week.review ?? null,
    days: (week.days ?? []).map(normalizeDay),
    createdAt: week.createdAt ?? now,
    updatedAt: week.updatedAt ?? now,
    metadata: week.metadata ?? {},
  };
}

/** @param {any} sprint */
export function normalizeSprint(sprint) {
  const now = nowIso();
  return {
    id: sprint.id ?? nanoid(),
    title: sprint.title,
    description: sprint.description ?? "",
    goal: sprint.goal ?? "",
    duration: sprint.duration ?? 7,
    totalWeeks: sprint.totalWeeks ?? 7,
    currentWeek: sprint.currentWeek ?? 1,
    progress: sprint.progress ?? 0,
    completed: sprint.completed ?? false,
    startDate: sprint.startDate ?? null,
    endDate: sprint.endDate ?? null,
    status: sprint.status ?? "idle",
    createdAt: sprint.createdAt ?? now,
    updatedAt: sprint.updatedAt ?? now,
    metadata: sprint.metadata ?? {},
  };
}

export { MANAGER_TIERS };
