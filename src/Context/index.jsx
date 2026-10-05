import { createContext, useReducer } from "react";

export const ExpenseContext = createContext(null);

const initialExpenses = [
  {
    id: 1,
    title: "Office Ergonomic Chair & Desk Pad",
    category: "Shopping",
    amount: 480,
    date: "Aug 25, 2026",
    description: "Workstation upgrade",
    icon: "🛍️",
  },
  {
    id: 2,
    title: "Weekend Cinema & Dinner",
    category: "Entertainment",
    amount: 150,
    date: "Aug 20, 2026",
    description: "Movie tickets and restaurant bill",
    icon: "🎬",
  },
  {
    id: 3,
    title: "Full Body Medical Health Checkup",
    category: "Medical",
    amount: 375,
    date: "Aug 15, 2026",
    description: "Annual medical examination",
    icon: "💊",
  },
  {
    id: 4,
    title: "High-speed Internet & Electricity",
    category: "Utilities",
    amount: 220,
    date: "Aug 10, 2026",
    description: "Utility bill payment",
    icon: "⚡",
  },
  {
    id: 5,
    title: "Supermarket Grocery & Supplies",
    category: "Food",
    amount: 420,
    date: "Aug 5, 2026",
    description: "Weekly essentials and vegetables",
    icon: "🍱",
  },
  {
    id: 6,
    title: "Monthly House Rent",
    category: "Rent",
    amount: 1200,
    date: "Aug 1, 2026",
    description: "Apartment monthly lease payment",
    icon: "🏠",
  },
];

const initialState = {
  expenses: initialExpenses,
  ui: {
    isExpenseModalOpen: false,
    editExpense: null,
  },
  filters: {
    selectedCategory: "All",
    sortBy: "date-desc",
    searchQuery: "",
  },
};

function expenseReducer(state, action) {
  switch (action.type) {
    case "ADD_EXPENSE": {
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    }
    case "UPDATE_EXPENSE": {
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id ? action.payload : expense
        ),
      };
    }
    case "DELETE_EXPENSE": {
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload),
      };
    }
    case "SET_EXPENSES": {
      return {
        ...state,
        expenses: action.payload,
      };
    }
    case "OPEN_MODAL": {
      return {
        ...state,
        ui: {
          ...state.ui,
          isExpenseModalOpen: true,
          editExpense: action.payload || null,
        },
      };
    }
    case "CLOSE_MODAL": {
      return {
        ...state,
        ui: {
          ...state.ui,
          isExpenseModalOpen: false,
          editExpense: null,
        },
      };
    }
    case "SET_CATEGORY_FILTER": {
      return {
        ...state,
        filters: {
          ...state.filters,
          selectedCategory: action.payload,
        },
      };
    }
    case "SET_SORT": {
      return {
        ...state,
        filters: {
          ...state.filters,
          sortBy: action.payload,
        },
      };
    }
    case "SET_SEARCH": {
      return {
        ...state,
        filters: {
          ...state.filters,
          searchQuery: action.payload,
        },
      };
    }
    case "RESET_FILTERS": {
      return {
        ...state,
        filters: {
          ...state.filters,
          selectedCategory: "All",
          sortBy: "date-desc",
          searchQuery: "",
        },
      };
    }
    default:
      return state;
  }
}

function getFilteredExpenses(expenses, filters) {
  let result = [...expenses];

  if (filters.selectedCategory !== "All") {
    result = result.filter((expense) => expense.category === filters.selectedCategory);
  }

  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase().trim();
    result = result.filter(
      (expense) =>
        expense.title.toLowerCase().includes(query) ||
        expense.description.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query)
    );
  }

  switch (filters.sortBy) {
    case "date-asc":
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case "date-desc":
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "amount-asc":
      result.sort((a, b) => a.amount - b.amount);
      break;
    case "amount-desc":
      result.sort((a, b) => b.amount - a.amount);
      break;
    default:
      break;
  }

  return result;
}

const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  const filteredExpenses = getFilteredExpenses(state.expenses, state.filters);

  const actions = {
    addExpense: (expense) => dispatch({ type: "ADD_EXPENSE", payload: expense }),
    updateExpense: (expense) => dispatch({ type: "UPDATE_EXPENSE", payload: expense }),
    deleteExpense: (id) => dispatch({ type: "DELETE_EXPENSE", payload: id }),
    setExpenses: (expensesOrFn) => {
      const newExpenses = typeof expensesOrFn === "function" 
        ? expensesOrFn(state.expenses) 
        : expensesOrFn;
      dispatch({ type: "SET_EXPENSES", payload: newExpenses });
    },
    openModalForNew: () => dispatch({ type: "OPEN_MODAL", payload: null }),
    openModalForEdit: (expense) => dispatch({ type: "OPEN_MODAL", payload: expense }),
    closeModal: () => dispatch({ type: "CLOSE_MODAL" }),
    setSelectedCategory: (category) => dispatch({ type: "SET_CATEGORY_FILTER", payload: category }),
    setSortBy: (sortBy) => dispatch({ type: "SET_SORT", payload: sortBy }),
    setSearchQuery: (query) => dispatch({ type: "SET_SEARCH", payload: query }),
    resetFilters: () => dispatch({ type: "RESET_FILTERS" }),
  };

  // Backward-compatible API
  const setIsExpenseModalOpen = (value) => {
    if (value === true) {
      actions.openModalForNew();
    } else if (value === false) {
      actions.closeModal();
    }
  };

  const setEditExpense = (expense) => {
    if (expense === null) {
      actions.closeModal();
    } else {
      actions.openModalForEdit(expense);
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses: state.expenses,
        setExpenses: actions.setExpenses,
        isExpenseModalOpen: state.ui.isExpenseModalOpen,
        setIsExpenseModalOpen,
        editExpense: state.ui.editExpense,
        setEditExpense,
        selectedCategory: state.filters.selectedCategory,
        setSelectedCategory: actions.setSelectedCategory,
        sortBy: state.filters.sortBy,
        setSortBy: actions.setSortBy,
        searchQuery: state.filters.searchQuery,
        setSearchQuery: actions.setSearchQuery,
        filteredExpenses,
        resetFilters: actions.resetFilters,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export { ExpenseProvider };