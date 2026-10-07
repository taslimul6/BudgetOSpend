import { DEFAULT_SETTINGS } from "../constants/settings";
import { SEED_EXPENSES } from "../constants/seed";
import { normalizeExpenses, normalizeSettings } from "../utils/normalize";
import { applyRecurring } from "../utils/recurring";
import { toMonthKey } from "../utils/date";
import { loadState } from "../utils/storage";
import { defaultMonth } from "./selectors";

export const DEFAULT_FILTERS = {
  typeFilter: "All",
  selectedCategory: "All",
  sortBy: "date-desc",
  searchQuery: "",
};

function prefersDark() {
  try {
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches === true;
  } catch {
    return false;
  }
}

export function createInitialState() {
  const stored = loadState();
  const expenses = applyRecurring(stored?.expenses ?? normalizeExpenses(SEED_EXPENSES));
  const settings = stored?.settings ?? {
    ...DEFAULT_SETTINGS,
    theme: prefersDark() ? "dark" : "light",
  };

  return {
    expenses,
    settings,
    ui: { isExpenseModalOpen: false, editExpense: null, isSettingsOpen: false },
    filters: { ...DEFAULT_FILTERS, selectedMonth: defaultMonth(expenses) },
  };
}

// A new recurring entry starts counting from its own month.
function withRecurringMeta(expense) {
  if (expense.recurring && !expense.lastGenerated) {
    return { ...expense, lastGenerated: toMonthKey(expense.date) };
  }
  if (!expense.recurring && expense.lastGenerated) {
    // eslint-disable-next-line no-unused-vars
    const { lastGenerated, ...rest } = expense;
    return rest;
  }
  return expense;
}

export function expenseReducer(state, action) {
  switch (action.type) {
    case "ADD_EXPENSE":
      return {
        ...state,
        expenses: applyRecurring([...state.expenses, withRecurringMeta(action.payload)]),
      };

    case "UPDATE_EXPENSE": {
      const updated = withRecurringMeta(action.payload);
      return {
        ...state,
        expenses: applyRecurring(
          state.expenses.map((e) => (e.id === updated.id ? updated : e))
        ),
      };
    }

    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter((e) => e.id !== action.payload),
      };

    case "RESTORE_EXPENSE":
      if (state.expenses.some((e) => e.id === action.payload.id)) return state;
      return { ...state, expenses: [...state.expenses, action.payload] };

    case "IMPORT_EXPENSES": {
      const { expenses: incoming, mode } = action.payload;
      let next;
      if (mode === "replace") {
        next = incoming;
      } else {
        const known = new Set(state.expenses.map((e) => e.id));
        next = [...state.expenses, ...incoming.filter((e) => !known.has(e.id))];
      }
      next = applyRecurring(next);
      return {
        ...state,
        expenses: next,
        filters: { ...state.filters, selectedMonth: defaultMonth(next) },
      };
    }

    case "OPEN_MODAL":
      return {
        ...state,
        ui: { ...state.ui, isExpenseModalOpen: true, editExpense: action.payload || null },
      };

    case "CLOSE_MODAL":
      return {
        ...state,
        ui: { ...state.ui, isExpenseModalOpen: false, editExpense: null },
      };

    case "OPEN_SETTINGS":
      return { ...state, ui: { ...state.ui, isSettingsOpen: true } };

    case "CLOSE_SETTINGS":
      return { ...state, ui: { ...state.ui, isSettingsOpen: false } };

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: normalizeSettings({ ...state.settings, ...action.payload }, state.settings),
      };

    case "TOGGLE_THEME":
      return {
        ...state,
        settings: { ...state.settings, theme: state.settings.theme === "dark" ? "light" : "dark" },
      };

    case "SET_TYPE_FILTER":
      // Categories differ per type, so a stale category filter would match nothing.
      return {
        ...state,
        filters: { ...state.filters, typeFilter: action.payload, selectedCategory: "All" },
      };

    case "SET_CATEGORY_FILTER":
      return { ...state, filters: { ...state.filters, selectedCategory: action.payload } };

    case "SET_SORT":
      return { ...state, filters: { ...state.filters, sortBy: action.payload } };

    case "SET_SEARCH":
      return { ...state, filters: { ...state.filters, searchQuery: action.payload } };

    case "SET_MONTH":
      return { ...state, filters: { ...state.filters, selectedMonth: action.payload } };

    case "RESET_FILTERS":
      return {
        ...state,
        filters: { ...DEFAULT_FILTERS, selectedMonth: defaultMonth(state.expenses) },
      };

    default:
      return state;
  }
}
