import { isValidCategory } from "../constants/categories";
import { CURRENCIES, DEFAULT_SETTINGS } from "../constants/settings";
import { parseToISO } from "./date";
import { newId } from "./id";

const MONTH_KEY = /^\d{4}-\d{2}$/;

// Coerces an untrusted record (localStorage, imported file, legacy data) into
// the canonical expense shape, or returns null when it cannot be salvaged.
export function normalizeExpense(raw) {
  if (!raw || typeof raw !== "object") return null;

  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  const amount = Number(raw.amount);
  const date = parseToISO(raw.date);
  if (!title || !Number.isFinite(amount) || amount <= 0 || !date) return null;

  const type = raw.type === "income" ? "income" : "expense";
  const fallbackCategory = type === "income" ? "Other Income" : "Other";

  const expense = {
    id: raw.id !== undefined && raw.id !== null && raw.id !== "" ? String(raw.id) : newId(),
    type,
    title,
    amount,
    category: isValidCategory(type, raw.category) ? raw.category : fallbackCategory,
    date,
    description: typeof raw.description === "string" ? raw.description : "",
    recurring: raw.recurring === true,
  };

  if (expense.recurring && typeof raw.lastGenerated === "string" && MONTH_KEY.test(raw.lastGenerated)) {
    expense.lastGenerated = raw.lastGenerated;
  }
  if (typeof raw.recurringSourceId === "string" && raw.recurringSourceId) {
    expense.recurringSourceId = raw.recurringSourceId;
  }

  return expense;
}

export function normalizeExpenses(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const result = [];
  for (const item of list) {
    const expense = normalizeExpense(item);
    if (expense && !seen.has(expense.id)) {
      seen.add(expense.id);
      result.push(expense);
    }
  }
  return result;
}

export function normalizeSettings(raw, fallback = DEFAULT_SETTINGS) {
  const source = raw && typeof raw === "object" ? raw : {};
  const budget = Number(source.budgetLimit);
  return {
    budgetLimit: Number.isFinite(budget) && budget > 0 ? budget : fallback.budgetLimit,
    currency: source.currency in CURRENCIES ? source.currency : fallback.currency,
    theme: source.theme === "dark" || source.theme === "light" ? source.theme : fallback.theme,
  };
}
