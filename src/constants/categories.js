// Single source of truth for every category. Colors are hex so they can be
// tinted with an alpha suffix and work in both light and dark themes.
export const EXPENSE_CATEGORIES = [
  { name: "Food", icon: "🍱", color: "#F4A77C" },
  { name: "Rent", icon: "🏠", color: "#80A1C1" },
  { name: "Entertainment", icon: "🎬", color: "#A78BFA" },
  { name: "Medical", icon: "💊", color: "#EF4444" },
  { name: "Utilities", icon: "⚡", color: "#F59E0B" },
  { name: "Shopping", icon: "🛍️", color: "#10B981" },
  { name: "Education", icon: "📚", color: "#6366F1" },
  { name: "Other", icon: "✨", color: "#9CA3AF" },
];

export const INCOME_CATEGORIES = [
  { name: "Salary", icon: "💼", color: "#16A34A" },
  { name: "Freelance", icon: "💻", color: "#0EA5E9" },
  { name: "Investment", icon: "📈", color: "#14B8A6" },
  { name: "Gift", icon: "🎁", color: "#EC4899" },
  { name: "Other Income", icon: "💰", color: "#84CC16" },
];

export const TYPES = ["expense", "income"];

const FALLBACK = EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];

const BY_NAME = new Map(
  [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map((c) => [c.name, c])
);

export function getCategory(name) {
  return BY_NAME.get(name) || FALLBACK;
}

export function categoriesForType(type) {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function isValidCategory(type, name) {
  return categoriesForType(type).some((c) => c.name === name);
}
