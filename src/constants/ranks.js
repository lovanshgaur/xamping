/**
 * Rank tiers. XP threshold is the minimum overall XP required to hold the rank.
 * Ordered ascending. Consumers must not mutate.
 */
export const RANKS = Object.freeze([
  { id: "apprentice", name: "Apprentice", minXP: 0 },
  { id: "junior", name: "Junior Engineer", minXP: 500 },
  { id: "software", name: "Software Engineer", minXP: 1500 },
  { id: "senior", name: "Senior Engineer", minXP: 3500 },
  { id: "lead", name: "Lead Engineer", minXP: 7000 },
  { id: "architect", name: "Architect", minXP: 12000 },
  { id: "principal", name: "Principal", minXP: 20000 },
]);

export const RANK_IDS = Object.freeze(RANKS.map((r) => r.id));
