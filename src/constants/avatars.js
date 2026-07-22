/**
 * Curated pop-culture avatar set.
 *
 * Twelve fixed characters, rendered via DiceBear's `adventurer` style with
 * deterministic seeds. One theme, twelve options — enough personality without
 * the noise of a full style catalog.
 */
export const AVATAR_STYLE = "adventurer";
export const DICEBEAR_BASE = "https://api.dicebear.com/9.x";

export const AVATAR_PRESETS = Object.freeze([
  { id: "nova", name: "Nova", seed: "Nova Reeves" },
  { id: "atlas", name: "Atlas", seed: "Atlas Hendrix" },
  { id: "juno", name: "Juno", seed: "Juno Park" },
  { id: "orion", name: "Orion", seed: "Orion Kade" },
  { id: "vex", name: "Vex", seed: "Vex Marlowe" },
  { id: "sable", name: "Sable", seed: "Sable Quinn" },
  { id: "ren", name: "Ren", seed: "Ren Okafor" },
  { id: "kaia", name: "Kaia", seed: "Kaia Voss" },
  { id: "milo", name: "Milo", seed: "Milo Kobayashi" },
  { id: "zia", name: "Zia", seed: "Zia Ferran" },
  { id: "rook", name: "Rook", seed: "Rook Delacroix" },
  { id: "wren", name: "Wren", seed: "Wren Achterberg" },
]);

export const DEFAULT_AVATAR_SEED = AVATAR_PRESETS[0].seed;
export const DEFAULT_AVATAR_STYLE = AVATAR_STYLE;

/** Legacy shim so existing imports keep working. */
export const AVATAR_STYLES = AVATAR_PRESETS.map((p) => ({ id: AVATAR_STYLE, name: p.name, seed: p.seed }));
