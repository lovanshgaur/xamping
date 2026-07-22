import { DEFAULT_AVATAR_STYLE } from "./avatars";

/**
 * Manager tiers keyed by rank id. Each rank unlocks a new mentor — the
 * persona art evolves from a fresh rookie up to the sage architect,
 * mirroring the employee's own climb.
 *
 * `avatarSeed` references a persona id in `AVATAR_PRESETS` so the
 * manager reuses the same pixel-art system as the employee.
 */
export const MANAGER_TIERS = Object.freeze([
  {
    rankId: "apprentice",
    name: "Milo Reyes",
    position: "Onboarding Buddy",
    level: "L1",
    company: "Forge Labs",
    avatarStyle: DEFAULT_AVATAR_STYLE,
    avatarSeed: "rookie",
    bio: "Just a year ahead of you — shows you where the coffee is and how the sprint runs.",
  },
  {
    rankId: "junior",
    name: "Sasha Brew",
    position: "Engineering Mentor",
    level: "L2",
    company: "Forge Labs",
    avatarStyle: DEFAULT_AVATAR_STYLE,
    avatarSeed: "brew",
    bio: "Runs mornings on ceremony and cortado — pairs on your first real feature.",
  },
  {
    rankId: "software",
    name: "Newt Ashby",
    position: "Senior Engineer",
    level: "L3",
    company: "Forge Labs",
    avatarStyle: DEFAULT_AVATAR_STYLE,
    avatarSeed: "newt",
    bio: "Quiet, sharp, dependable. Reviews your PRs and pushes for shipping cadence.",
  },
  {
    rankId: "senior",
    name: "Chief Hendrix",
    position: "Staff Engineer",
    level: "L4",
    company: "Forge Labs",
    avatarStyle: DEFAULT_AVATAR_STYLE,
    avatarSeed: "chief",
    bio: "Runs the workshop. Owns architectural direction and cross-team code standards.",
  },
  {
    rankId: "lead",
    name: "Agent Voss",
    position: "Engineering Manager",
    level: "L5",
    company: "Forge Labs",
    avatarStyle: DEFAULT_AVATAR_STYLE,
    avatarSeed: "agent",
    bio: "Suits up for the roadmap. Balances delivery, mentorship, and long-term craft.",
  },
  {
    rankId: "architect",
    name: "Walter K.",
    position: "Principal Architect",
    level: "L6",
    company: "Forge Labs",
    avatarStyle: DEFAULT_AVATAR_STYLE,
    avatarSeed: "cook",
    bio: "Chemistry-grade precision. Shapes the platform's long-horizon technical direction.",
  },
  {
    rankId: "principal",
    name: "The Sage",
    position: "VP of Engineering",
    level: "L7",
    company: "Forge Labs",
    avatarStyle: DEFAULT_AVATAR_STYLE,
    avatarSeed: "sage",
    bio: "Architect of unseen systems. Partners with principals on company-wide excellence.",
  },
]);

/** @param {string} rankId */
export function getManagerForRank(rankId) {
  return (
    MANAGER_TIERS.find((m) => m.rankId === rankId) ?? MANAGER_TIERS[0]
  );
}
