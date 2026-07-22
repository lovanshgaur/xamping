// Single ambient background used across every route.
import orange from "@/assets/bg/orange-gradient.jpg.asset.json";

export const BACKGROUNDS = {
  orange: orange.url,
};

// Every route resolves to the same orange gradient scene.
export const ROUTE_BG = {
  "/": orange.url,
  "/today": orange.url,
  "/learn": orange.url,
  "/build": orange.url,
  "/grow": orange.url,
  "/career": orange.url,
  "/operate": orange.url,
  "/manager": orange.url,
  "/analytics": orange.url,
  "/profile": orange.url,
  "/timer": orange.url,
};

export function backgroundForPath() {
  return orange.url;
}
