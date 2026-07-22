import { DEFAULT_AVATAR_STYLE } from "./avatars";

/**
 * Manager tiers keyed by rank id. Each rank unlocks a new mentor.
 * `avatarSeed` drives DiceBear so the identity is stable & unique.
 */
export const MANAGER_TIERS = Object.freeze([
  {
    rankId: "apprentice",
    name: "Nadia Okafor",
    position: "Engineering Mentor",
    level: "L4",
    company: "Forge Labs",
    avatarStyle: DEFAULT_AVATAR_STYLE,
    avatarSeed: "nadia-okafor",
    bio: "Guides new apprentices through their first fundamentals sprint.",
  },
  {
    rankId: "junior",
    name: "Marcus Vale",
    position: "Senior Engineer",
    level: "L5",
    company: "Forge Labs",
    avatarStyle: DEFAULT_AVATAR_STYLE,
    avatarSeed: "marcus-vale",
    bio: "Reviews product code and pushes for consistent shipping cadence.",
  },
  {
    rankId: "software",
    name: "Ines Marchetti",
    position: "Staff Engineer",
    level: "L6",
    company: "Forge Labs",
    avatarStyle: DEFAULT_AVATAR_STYLE,
    avatarSeed: "ines-marchetti",
    bio: "Owns architectural direction and cross-team code standards.",
  },
  {
    rankId: "senior",
    name: "Rafael Duarte",
    position: "Engineering Manager",
    level: "L7",
    company: "Forge Labs",
    avatarStyle: DEFAULT_AVATAR_STYLE,
    avatarSeed: "rafael-duarte",
    bio: "Balances delivery, mentorship, and long-term craft.",
  },
  {
    rankId: "lead",
    name: "Aiko Nakamura",
    position: "Director of Engineering",
    level: "L8",
    company: "Forge Labs",
    avatarStyle: DEFAULT_AVATAR_STYLE,
    avatarSeed: "aiko-nakamura",
    bio: "Sets multi-team strategy and coaches emerging leads.",
  },
  {
    rankId: "architect",
    name: "Owen Ashford",
    position: "Principal Architect",
    level: "L9",
    company: "Forge Labs",
    avatarStyle: DEFAULT_AVATAR_STYLE,
    avatarSeed: "owen-ashford",
    bio: "Shapes the platform's long-horizon technical direction.",
  },
  {
    rankId: "principal",
    name: "Dr. Selene Vaughn",
    position: "VP of Engineering",
    level: "L10",
    company: "Forge Labs",
    avatarStyle: DEFAULT_AVATAR_STYLE,
    avatarSeed: "selene-vaughn",
    bio: "Partners with principals on company-wide engineering excellence.",
  },
]);

/** @param {string} rankId */
export function getManagerForRank(rankId) {
  return (
    MANAGER_TIERS.find((m) => m.rankId === rankId) ?? MANAGER_TIERS[0]
  );
}
