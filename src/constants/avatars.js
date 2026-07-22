/**
 * Curated pixel-art persona set. Eleven hand-picked characters — one visual
 * theme (retro pixel art), enough personality without preset noise.
 *
 * Each persona's `image` is a Lovable CDN asset URL. `seed` is the stable
 * identifier persisted in storage (kept as `seed` for backwards compat
 * with the previous DiceBear-based schema).
 */
import wizardAsset from "@/assets/pixel/pixelated-a-wizard-holding-a-wand-with-no-background-icon-design.jpg.asset.json";
import skeletonAsset from "@/assets/pixel/somepixel-patrick-rodrigues.jpg.asset.json";
import rangerAsset from "@/assets/pixel/pixel-art.jpg.asset.json";
import heisenbergAsset from "@/assets/pixel/pixilart-heisenberg.jpg.asset.json";
import brewAsset from "@/assets/pixel/cozy-pixel-morning-mood.jpg.asset.json";
import punkAsset from "@/assets/pixel/drewz.jpg.asset.json";
import newtAsset from "@/assets/pixel/newt-pixel-art-the-maze-runner.jpg.asset.json";
import chiefAsset from "@/assets/pixel/907827237396359524.jpg.asset.json";
import clerkAsset from "@/assets/pixel/pixel-path-icon2.jpg.asset.json";
import agentAsset from "@/assets/pixel/907827237395411177.jpg.asset.json";
import rookieAsset from "@/assets/pixel/461478293068682911.jpg.asset.json";
import shadowAsset from "@/assets/pixel/shadow-blade.jpg.asset.json";
import katboyAsset from "@/assets/pixel/katboy.jpg.asset.json";
import crimsonAsset from "@/assets/pixel/crimson-mage.jpg.asset.json";

export const AVATAR_STYLE = "pixel";

export const AVATAR_PRESETS = Object.freeze([
  { id: "rookie", name: "Rookie", seed: "rookie", image: rookieAsset.url, tagline: "Day one, badge on." },
  { id: "brew", name: "Brew", seed: "brew", image: brewAsset.url, tagline: "Coffee-fueled focus." },
  { id: "katboy", name: "Katboy", seed: "katboy", image: katboyAsset.url, tagline: "Hoodie up, cat in tow." },
  { id: "newt", name: "Newt", seed: "newt", image: newtAsset.url, tagline: "Quiet, sharp, dependable." },
  { id: "punk", name: "Drewz", seed: "punk", image: punkAsset.url, tagline: "Shades on, ships fast." },
  { id: "ranger", name: "Ranger", seed: "ranger", image: rangerAsset.url, tagline: "Sword in one hand, console in the other." },
  { id: "shadow", name: "Shadow", seed: "shadow", image: shadowAsset.url, tagline: "Moves between commits, unseen." },
  { id: "chief", name: "Chief", seed: "chief", image: chiefAsset.url, tagline: "Runs the workshop." },
  { id: "clerk", name: "Clerk", seed: "clerk", image: clerkAsset.url, tagline: "Keeps the ledger clean." },
  { id: "agent", name: "Agent", seed: "agent", image: agentAsset.url, tagline: "Suit up. Ship it." },
  { id: "reaper", name: "Reaper", seed: "reaper", image: skeletonAsset.url, tagline: "Debugging from the beyond." },
  { id: "cook", name: "Cook", seed: "cook", image: heisenbergAsset.url, tagline: "Chemistry-grade precision." },
  { id: "crimson", name: "Crimson", seed: "crimson", image: crimsonAsset.url, tagline: "Hooded caster, blade of light." },
  { id: "sage", name: "Sage", seed: "sage", image: wizardAsset.url, tagline: "Architect of unseen systems." },
]);


const PRESET_BY_SEED = new Map(AVATAR_PRESETS.map((p) => [p.seed, p]));

/** Look up a persona by its seed id. Falls back to the default. */
export function getPersona(seed) {
  return PRESET_BY_SEED.get(seed) ?? AVATAR_PRESETS[0];
}

export const DEFAULT_AVATAR_SEED = AVATAR_PRESETS[0].seed;
export const DEFAULT_AVATAR_STYLE = AVATAR_STYLE;

/** Legacy shim so any lingering imports keep working. */
export const AVATAR_STYLES = AVATAR_PRESETS.map((p) => ({ id: AVATAR_STYLE, name: p.name, seed: p.seed }));
