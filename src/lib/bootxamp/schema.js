import { z } from "zod";
import { DEPARTMENT_IDS } from "@/constants/departments";
import { SCHEMA_VERSION } from "@/config/storage";

/**
 * BootXamp domain shapes. Documented with JSDoc typedefs for editor
 * intellisense and validated at import boundaries with Zod schemas.
 *
 * @typedef {"learn" | "build" | "grow" | "career" | "operate"} DepartmentId
 * @typedef {"apprentice" | "junior" | "software" | "senior" | "lead" | "architect" | "principal"} RankId
 *
 * @typedef {Object} MetaFields
 * @property {string} id
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} [description]
 * @property {DepartmentId} department
 * @property {number} [estimatedTime]  minutes
 * @property {"low"|"medium"|"high"} [priority]
 * @property {"easy"|"medium"|"hard"|"epic"} [difficulty]
 * @property {number} [xp]
 * @property {boolean} completed
 * @property {string | null} completedAt
 * @property {string} [evidence]
 * @property {string} [notes]
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} Department
 * @property {string} id
 * @property {DepartmentId} slug
 * @property {string} name
 * @property {string} [description]
 * @property {number} xp
 * @property {number} level
 * @property {number} progress   0..1
 * @property {Record<string, number>} statistics
 * @property {Task[]} tasks
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} Review
 * @property {string} id
 * @property {string[]} strengths
 * @property {string[]} weaknesses
 * @property {string[]} blockers
 * @property {string} managerRemarks
 * @property {string} employeeReflection
 * @property {number} overallRating   0..5
 * @property {string | null} submittedAt
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} Day
 * @property {string} id
 * @property {number} dayNumber
 * @property {string} date
 * @property {string} theme
 * @property {string} mission
 * @property {string} managerBrief
 * @property {number} estimatedHours
 * @property {number} score
 * @property {number} progress   0..1
 * @property {"upcoming"|"active"|"submitted"} status
 * @property {boolean} completed
 * @property {boolean} submitted
 * @property {Department[]} departments
 * @property {Review | null} review
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} Week
 * @property {string} id
 * @property {number} weekNumber
 * @property {string} title
 * @property {string} objective
 * @property {string} theme
 * @property {number} progress   0..1
 * @property {boolean} completed
 * @property {number} totalXP
 * @property {Review | null} review
 * @property {Day[]} days
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} Sprint
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} goal
 * @property {number} duration        weeks
 * @property {number} totalWeeks
 * @property {number} currentWeek
 * @property {number} progress        0..1
 * @property {boolean} completed
 * @property {string | null} startDate
 * @property {string | null} endDate
 * @property {"idle"|"active"|"complete"} status
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} PromotionEntry
 * @property {string} id
 * @property {RankId} rank
 * @property {number} atXP
 * @property {string} occurredAt
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} Employee
 * @property {string} id
 * @property {string} name
 * @property {string} avatar
 * @property {string} designation
 * @property {string} company
 * @property {string | null} joinDate
 * @property {number} overallXP
 * @property {number} overallLevel
 * @property {RankId} overallRank
 * @property {number} currentStreak
 * @property {number} longestStreak
 * @property {number} totalHours
 * @property {number} totalTasksCompleted
 * @property {number} totalProjectsCompleted
 * @property {number} totalApplications
 * @property {number} totalCommits
 * @property {number} totalReviews
 * @property {PromotionEntry[]} promotionHistory
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} Manager
 * @property {string} id
 * @property {string} name
 * @property {string} designation
 * @property {string} company
 * @property {string} currentTheme
 * @property {string} currentMission
 * @property {{id:string,title:string,body:string,createdAt:string}[]} announcements
 * @property {{id:string,body:string,createdAt:string}[]} notes
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} Achievement
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} icon
 * @property {boolean} unlocked
 * @property {string | null} unlockedAt
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} AnalyticsPoint
 * @property {string} date
 * @property {number} value
 *
 * @typedef {Object} Analytics
 * @property {AnalyticsPoint[]} codingHours
 * @property {AnalyticsPoint[]} studyHours
 * @property {AnalyticsPoint[]} readingHours
 * @property {AnalyticsPoint[]} exerciseHours
 * @property {AnalyticsPoint[]} sleepHours
 * @property {AnalyticsPoint[]} calories
 * @property {AnalyticsPoint[]} heartPoints
 * @property {AnalyticsPoint[]} focus
 * @property {AnalyticsPoint[]} energy
 * @property {AnalyticsPoint[]} applications
 * @property {AnalyticsPoint[]} commits
 *
 * @typedef {Object} TimelineItem
 * @property {string} id
 * @property {string} type
 * @property {string} title
 * @property {string} [description]
 * @property {string} timestamp
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} ImportRecord
 * @property {string} id
 * @property {string} fileName
 * @property {string} importedAt
 * @property {number} version
 * @property {boolean} success
 * @property {string} [kind]
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} ExportRecord
 * @property {string} id
 * @property {string} exportedAt
 * @property {"daily"|"weekly"|"department"|"career"|"backup"} type
 * @property {number} version
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} History
 * @property {TimelineItem[]} timeline
 * @property {TimelineItem[]} activity
 * @property {PromotionEntry[]} promotions
 * @property {ImportRecord[]} imports
 * @property {ExportRecord[]} exports
 *
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {"info"|"success"|"warning"|"error"} type
 * @property {boolean} read
 * @property {string} createdAt
 * @property {Record<string, any>} metadata
 *
 * @typedef {Object} Settings
 * @property {"light"|"dark"|"system"} theme
 * @property {string} accentColor
 * @property {boolean} animations
 * @property {boolean} reducedMotion
 * @property {boolean} sidebarCollapsed
 * @property {boolean} exportBeforeReset
 *
 * @typedef {Object} UIState
 * @property {string} activePage
 * @property {string | null} selectedWeek
 * @property {string | null} selectedDay
 * @property {DepartmentId | null} activeDepartment
 * @property {boolean} sidebarOpen
 * @property {string | null} modal
 *
 * @typedef {Object} AppState
 * @property {string} version
 * @property {string} build
 * @property {string} createdAt
 * @property {string} lastOpened
 * @property {string} lastUpdated
 * @property {string | null} currentSprintId
 * @property {string | null} currentWeekId
 * @property {string | null} currentDayId
 *
 * @typedef {Object} BootXampData
 * @property {AppState} app
 * @property {Employee} employee
 * @property {Manager} manager
 * @property {Sprint | null} sprint
 * @property {Week[]} weeks
 * @property {Achievement[]} achievements
 * @property {Analytics} analytics
 * @property {History} history
 * @property {Notification[]} notifications
 * @property {Settings} settings
 * @property {UIState} ui
 * @property {ImportRecord[]} imports
 * @property {ExportRecord[]} exports
 *
 * @typedef {Object} Envelope
 * @property {number} version
 * @property {number} schema
 * @property {BootXampData} data
 */

/* ------------------------------ Zod validators ------------------------------ */

const departmentIdSchema = z.enum([...DEPARTMENT_IDS]);

const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  department: departmentIdSchema,
  estimatedTime: z.number().nonnegative().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  difficulty: z.enum(["easy", "medium", "hard", "epic"]).optional(),
  xp: z.number().nonnegative().optional(),
  completed: z.boolean().default(false),
  completedAt: z.string().nullable().default(null),
  evidence: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const departmentSchema = z.object({
  id: z.string().optional(),
  slug: departmentIdSchema,
  name: z.string().optional(),
  description: z.string().optional(),
  xp: z.number().nonnegative().default(0),
  level: z.number().int().nonnegative().default(1),
  progress: z.number().min(0).max(1).default(0),
  statistics: z.record(z.string(), z.number()).default({}),
  tasks: z.array(taskSchema).default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const reviewSchema = z.object({
  id: z.string().optional(),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  blockers: z.array(z.string()).default([]),
  managerRemarks: z.string().default(""),
  employeeReflection: z.string().default(""),
  overallRating: z.number().min(0).max(5).default(0),
  submittedAt: z.string().nullable().default(null),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const daySchema = z.object({
  id: z.string().optional(),
  dayNumber: z.number().int().positive(),
  date: z.string(),
  theme: z.string().default(""),
  mission: z.string().default(""),
  managerBrief: z.string().default(""),
  estimatedHours: z.number().nonnegative().default(0),
  score: z.number().nonnegative().default(0),
  progress: z.number().min(0).max(1).default(0),
  status: z.enum(["upcoming", "active", "submitted"]).default("upcoming"),
  completed: z.boolean().default(false),
  submitted: z.boolean().default(false),
  departments: z.array(departmentSchema),
  review: reviewSchema.nullable().default(null),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const weekSchema = z.object({
  id: z.string().optional(),
  weekNumber: z.number().int().positive(),
  title: z.string().default(""),
  objective: z.string().default(""),
  theme: z.string().default(""),
  progress: z.number().min(0).max(1).default(0),
  completed: z.boolean().default(false),
  totalXP: z.number().nonnegative().default(0),
  review: reviewSchema.nullable().default(null),
  days: z.array(daySchema).default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const sprintSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().default(""),
  goal: z.string().default(""),
  duration: z.number().int().positive().default(7),
  totalWeeks: z.number().int().positive().default(7),
  currentWeek: z.number().int().nonnegative().default(1),
  progress: z.number().min(0).max(1).default(0),
  completed: z.boolean().default(false),
  startDate: z.string().nullable().default(null),
  endDate: z.string().nullable().default(null),
  status: z.enum(["idle", "active", "complete"]).default("idle"),
  weeks: z.array(weekSchema).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const personalSchema = z.object({
  kind: z.literal("personal").optional(),
  name: z.string().optional(),
  designation: z.string().optional(),
  company: z.string().optional(),
  birthday: z.string().nullable().optional(),
  bio: z.string().optional(),
  height: z.number().nullable().optional(),
  weight: z.number().nullable().optional(),
  avatar: z
    .object({
      style: z.string().optional(),
      seed: z.string(),
    })
    .optional(),
  socials: z
    .object({
      github: z.string().optional(),
      linkedin: z.string().optional(),
      website: z.string().optional(),
      twitter: z.string().optional(),
    })
    .optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const importSchemas = {
  sprint: sprintSchema,
  week: weekSchema,
  day: daySchema,
  review: reviewSchema.extend({ dayId: z.string() }),
  personal: personalSchema,
};

export const envelopeSchema = z.object({
  version: z.number().int().positive(),
  schema: z.number().int().positive(),
  data: z.any(),
});

/**
 * Detect what kind of import payload a JSON blob represents.
 * @param {unknown} raw
 * @returns {"sprint"|"week"|"day"|"review"|"personal"|"unknown"}
 */
export function detectImportKind(raw) {
  if (!raw || typeof raw !== "object") return "unknown";
  const obj = /** @type {any} */ (raw);
  if (obj.kind === "personal") return "personal";
  if (typeof obj.dayNumber === "number" && Array.isArray(obj.departments)) return "day";
  if (typeof obj.weekNumber === "number" && Array.isArray(obj.days)) return "week";
  if (typeof obj.totalWeeks === "number" || typeof obj.goal === "string") return "sprint";
  if (typeof obj.dayId === "string" && Array.isArray(obj.strengths)) return "review";
  if (typeof obj.bio === "string" || (obj.name && (obj.birthday !== undefined || obj.avatar))) return "personal";
  return "unknown";
}


export const CURRENT_SCHEMA_VERSION = SCHEMA_VERSION;
