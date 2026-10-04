export const THEMES = ["dark", "light", "system"];
export const DEFAULT_APPEARANCE = { theme: "dark" };

export function validateAppearance(value) {
  if (!value || !THEMES.includes(value.theme))
    throw new Error("Choose Dark, Light, or System for your theme.");
  return { theme: value.theme };
}
