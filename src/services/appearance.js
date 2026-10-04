import { validateAppearance } from "../../shared/functions/appearance.mjs";

const cacheKey = (uid) => `form:appearance:${uid}`;

// A per-account startup hint. Firestore remains the source of truth.
export function readAppearanceCache(uid) {
  try {
    return validateAppearance(JSON.parse(localStorage.getItem(cacheKey(uid))));
  } catch {
    return { theme: "dark" };
  }
}

export function cacheAppearance(uid, value) {
  try {
    localStorage.setItem(cacheKey(uid), JSON.stringify(value));
  } catch {
    // Themes still save and sync when browser storage is blocked.
  }
}
