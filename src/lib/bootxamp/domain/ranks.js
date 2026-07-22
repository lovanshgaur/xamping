import { RANKS } from "@/constants/ranks";

/** @param {number} xp */
export function getRank(xp) {
  let current = RANKS[0];
  for (const r of RANKS) if (xp >= r.minXP) current = r;
  return current;
}

/** @param {number} xp */
export function getNextRank(xp) {
  const idx = RANKS.findIndex((r) => xp < r.minXP);
  return idx === -1 ? null : RANKS[idx];
}

/** 0..1 progress toward the next rank. Returns 1 at max rank. */
export function getRankProgress(xp) {
  const cur = getRank(xp);
  const next = getNextRank(xp);
  if (!next) return 1;
  const span = next.minXP - cur.minXP;
  if (span <= 0) return 1;
  return Math.min(1, Math.max(0, (xp - cur.minXP) / span));
}
