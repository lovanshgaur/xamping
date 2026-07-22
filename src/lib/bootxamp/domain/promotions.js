import { getRank } from "./ranks";

/**
 * Detect whether a promotion is due given previous and next XP totals.
 * @param {number} prevXP
 * @param {number} nextXP
 * @returns {{ promoted: boolean, from: ReturnType<typeof getRank>, to: ReturnType<typeof getRank> }}
 */
export function detectPromotion(prevXP, nextXP) {
  const from = getRank(prevXP);
  const to = getRank(nextXP);
  return { promoted: from.id !== to.id, from, to };
}
