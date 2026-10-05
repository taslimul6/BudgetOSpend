import { useContext } from "react";
import { ExpenseContext } from "../Context";

const EmptyState = () => {
  const { setIsExpenseModalOpen } = useContext(ExpenseContext);

  return (
    <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-[#111827]/20 shadow-sm max-w-md w-full">
      <div className="w-36 h-36 mx-auto mb-5 rounded-full bg-[#FFF5E6] flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-[#FAD4C0]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-[#111827]">List is empty!</h3>
      <p className="text-sm text-[#6B7280] mt-2 mb-6">
        You haven't recorded any expenses yet. Keep your finances organized by adding your first transaction.
      </p>
      <button
        onClick={() => setIsExpenseModalOpen(true)}
        className="inline-flex items-center gap-2 bg-[#FAD4C0] hover:bg-[#f5c0a7] text-[#111827] px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm border border-[#111827]/10 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        <span>Add First Expense</span>
      </button>
    </div>
  );
};

export default EmptyState;