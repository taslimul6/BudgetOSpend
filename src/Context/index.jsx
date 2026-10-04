import { createContext, useState } from "react";

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


const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const[isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editExpense, setEditExpense] = useState(null);

  return (
    <ExpenseContext.Provider value={{ expenses, setExpenses, isExpenseModalOpen, setIsExpenseModalOpen, editExpense, setEditExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export  {ExpenseProvider};