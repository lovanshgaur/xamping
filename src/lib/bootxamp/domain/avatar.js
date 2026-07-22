import {
  AVATAR_STYLE,
  DEFAULT_AVATAR_SEED,
  AVATAR_PRESETS,
  getPersona,
} from "@/constants/avatars";

/**
 * Return the image URL for a persona seed. Size is a hint used by consumers
 * for layout; the CDN asset is a single raster and is rendered pixel-perfect
 * via CSS (`image-rendering: pixelated`).
 *
 * @param {{ style?: string, seed?: string, size?: number }} opts
 */
export function buildAvatarUrl({ seed } = {}) {
  return getPersona(seed || DEFAULT_AVATAR_SEED).image;
}

/** Random preset seed. */
export function randomSeed() {
  const p = AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)];
  return p.seed;
}

/**
 * Normalize any legacy avatar value into `{ style, seed }`. Older DiceBear
 * seeds that no longer map to a persona collapse to the default.
 */
export function normalizeAvatar(value) {
  if (value && typeof value === "object" && value.seed) {
    const known = AVATAR_PRESETS.some((p) => p.seed === value.seed);
    return { style: AVATAR_STYLE, seed: known ? value.seed : DEFAULT_AVATAR_SEED };
  }
  if (typeof value === "string" && value.length > 0) {
    const known = AVATAR_PRESETS.some((p) => p.seed === value);
    return { style: AVATAR_STYLE, seed: known ? value : DEFAULT_AVATAR_SEED };
  }
  return { style: AVATAR_STYLE, seed: DEFAULT_AVATAR_SEED };
}
