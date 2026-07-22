import { AVATAR_STYLE, DEFAULT_AVATAR_SEED, DICEBEAR_BASE, AVATAR_PRESETS } from "@/constants/avatars";

/**
 * Build a DiceBear SVG URL for the given seed. The app uses a single style
 * (`adventurer`) — twelve curated seeds provide the variety.
 *
 * @param {{ style?: string, seed?: string, size?: number, radius?: number, background?: string }} opts
 */
export function buildAvatarUrl({ style, seed, size = 128, radius = 12, background } = {}) {
  const s = style || AVATAR_STYLE;
  const seedValue = seed || DEFAULT_AVATAR_SEED;
  const params = new URLSearchParams({
    seed: seedValue,
    size: String(size),
    radius: String(radius),
  });
  if (background) params.set("backgroundColor", background.replace(/^#/, ""));
  return `${DICEBEAR_BASE}/${s}/svg?${params.toString()}`;
}

/** Random preset seed. */
export function randomSeed() {
  const p = AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)];
  return p.seed;
}

/**
 * Normalize any legacy avatar value into `{ style, seed }`. Old free-style
 * pickers stored various DiceBear collection ids — those collapse to the
 * single `adventurer` style with the seed preserved.
 */
export function normalizeAvatar(value) {
  if (value && typeof value === "object" && value.seed) {
    return { style: AVATAR_STYLE, seed: value.seed };
  }
  if (typeof value === "string" && value.length > 0) {
    return { style: AVATAR_STYLE, seed: value };
  }
  return { style: AVATAR_STYLE, seed: DEFAULT_AVATAR_SEED };
}
