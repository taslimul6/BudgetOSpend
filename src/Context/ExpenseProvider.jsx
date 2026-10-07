import { useEffect, useMemo, useReducer } from "react";
import { ExpenseContext } from "./ExpenseContext";
import { createInitialState, expenseReducer } from "./reducer";
import { getFilteredExpenses, getMonthExpenses } from "./selectors";
import { saveState } from "../utils/storage";

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, undefined, createInitialState);
  const { expenses, settings, ui, filters } = state;

  useEffect(() => {
    saveState({ expenses, settings });
  }, [expenses, settings]);

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  // `dispatch` is stable, so the action creators never change identity.
  const actions = useMemo(
    () => ({
      addExpense: (expense) => dispatch({ type: "ADD_EXPENSE", payload: expense }),
      updateExpense: (expense) => dispatch({ type: "UPDATE_EXPENSE", payload: expense }),
      deleteExpense: (id) => dispatch({ type: "DELETE_EXPENSE", payload: id }),
      restoreExpense: (expense) => dispatch({ type: "RESTORE_EXPENSE", payload: expense }),
      importExpenses: (list, mode) =>
        dispatch({ type: "IMPORT_EXPENSES", payload: { expenses: list, mode } }),
      openModalForNew: () => dispatch({ type: "OPEN_MODAL", payload: null }),
      openModalForEdit: (expense) => dispatch({ type: "OPEN_MODAL", payload: expense }),
      closeModal: () => dispatch({ type: "CLOSE_MODAL" }),
      openSettings: () => dispatch({ type: "OPEN_SETTINGS" }),
      closeSettings: () => dispatch({ type: "CLOSE_SETTINGS" }),
      updateSettings: (patch) => dispatch({ type: "UPDATE_SETTINGS", payload: patch }),
      toggleTheme: () => dispatch({ type: "TOGGLE_THEME" }),
      setTypeFilter: (type) => dispatch({ type: "SET_TYPE_FILTER", payload: type }),
      setSelectedCategory: (category) =>
        dispatch({ type: "SET_CATEGORY_FILTER", payload: category }),
      setSortBy: (sortBy) => dispatch({ type: "SET_SORT", payload: sortBy }),
      setSearchQuery: (query) => dispatch({ type: "SET_SEARCH", payload: query }),
      setSelectedMonth: (month) => dispatch({ type: "SET_MONTH", payload: month }),
      resetFilters: () => dispatch({ type: "RESET_FILTERS" }),
    }),
    []
  );

  const monthExpenses = useMemo(
    () => getMonthExpenses(expenses, filters.selectedMonth),
    [expenses, filters.selectedMonth]
  );

  const filteredExpenses = useMemo(
    () => getFilteredExpenses(monthExpenses, filters),
    [monthExpenses, filters]
  );

  const value = useMemo(
    () => ({
      expenses,
      monthExpenses,
      filteredExpenses,
      settings,
      isExpenseModalOpen: ui.isExpenseModalOpen,
      editExpense: ui.editExpense,
      isSettingsOpen: ui.isSettingsOpen,
      ...filters,
      ...actions,
    }),
    [expenses, monthExpenses, filteredExpenses, settings, ui, filters, actions]
  );

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};
