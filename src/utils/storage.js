/** @returns {boolean} */
export function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** @returns {number} bytes currently stored under all keys of localStorage */
export function localStorageBytes() {
  if (!isBrowser()) return 0;
  let total = 0;
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (!key) continue;
    const value = window.localStorage.getItem(key) ?? "";
    total += key.length + value.length;
  }
  // Each JS string char is 2 bytes in UTF-16.
  return total * 2;
}
