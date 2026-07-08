// Theme + category glow helpers

export type CategoryGlow =
  | "education" | "cyber" | "developer" | "content" | "media" | "paid" | "free" | "default";

export const GLOW_HEX: Record<CategoryGlow, string> = {
  education: "#ff8a3d",   // sunset orange
  cyber:     "#39ff88",   // toxic neon green
  developer: "#1e63ff",   // deep ocean blue
  content:   "#ff5edb",   // magenta pop
  media:     "#ffd23d",   // golden sun
  paid:      "#a855f7",   // premium purple
  free:      "#22d3ee",   // turquoise
  default:   "#22d3ee",
};

export function glowStyle(cat: CategoryGlow = "default"): React.CSSProperties {
  return { ["--glow" as string]: GLOW_HEX[cat] };
}

const THEME_KEY = "ai-router-theme";
export type ThemeMode = "light" | "dark";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  return (window.localStorage.getItem(THEME_KEY) as ThemeMode) || "light";
}
export function setStoredTheme(t: ThemeMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, t);
  document.documentElement.classList.toggle("dark", t === "dark");
}
export function applyStoredTheme() {
  if (typeof window === "undefined") return;
  document.documentElement.classList.toggle("dark", getStoredTheme() === "dark");
}
