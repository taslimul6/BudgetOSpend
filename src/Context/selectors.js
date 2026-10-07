import { toMonthKey, todayISO } from "../utils/date";

export const ALL_MONTHS = "all";

export function getMonthExpenses(expenses, selectedMonth) {
  if (selectedMonth === ALL_MONTHS) return expenses;
  return expenses.filter((e) => toMonthKey(e.date) === selectedMonth);
}

export function getFilteredExpenses(monthExpenses, filters) {
  let result = [...monthExpenses];

  if (filters.typeFilter !== "All") {
    result = result.filter((e) => e.type === filters.typeFilter);
  }

  if (filters.selectedCategory !== "All") {
    result = result.filter((e) => e.category === filters.selectedCategory);
  }

  const query = filters.searchQuery.trim().toLowerCase();
  if (query) {
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query)
    );
  }

  switch (filters.sortBy) {
    case "date-asc":
      result.sort((a, b) => a.date.localeCompare(b.date));
      break;
    case "amount-asc":
      result.sort((a, b) => a.amount - b.amount);
      break;
    case "amount-desc":
      result.sort((a, b) => b.amount - a.amount);
      break;
    case "date-desc":
    default:
      result.sort((a, b) => b.date.localeCompare(a.date));
      break;
  }

  return result;
}

// The current month if it has records, otherwise the most recent month that
// does, otherwise the current month.
export function defaultMonth(expenses, today = todayISO()) {
  const current = toMonthKey(today);
  if (expenses.length === 0) return current;
  let latest = "";
  for (const e of expenses) {
    const month = toMonthKey(e.date);
    if (month === current) return current;
    if (month > latest) latest = month;
  }
  return latest;
}

export function computeTotals(list) {
  let income = 0;
  let expense = 0;
  let expenseCount = 0;
  const byCategory = {};
  for (const e of list) {
    if (e.type === "income") {
      income += e.amount;
    } else {
      expense += e.amount;
      expenseCount += 1;
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    }
  }
  return { income, expense, expenseCount, balance: income - expense, byCategory };
}

export function countMonths(list) {
  return Math.max(1, new Set(list.map((e) => toMonthKey(e.date))).size);
}
