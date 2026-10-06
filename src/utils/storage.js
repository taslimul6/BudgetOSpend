import { STORAGE_KEY } from "../constants/settings";
import { normalizeExpenses, normalizeSettings } from "./normalize";

// Returns { expenses, settings } or null when nothing usable is stored.
export function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return {
      expenses: Array.isArray(parsed.expenses) ? normalizeExpenses(parsed.expenses) : null,
      settings: parsed.settings ? normalizeSettings(parsed.settings) : null,
    };
  } catch {
    return null;
  }
}

export function saveState({ expenses, settings }) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 1, expenses, settings })
    );
  } catch {
    // Storage may be full or unavailable (private mode); the app keeps working in memory.
  }
}
