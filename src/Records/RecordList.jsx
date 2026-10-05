import { useContext } from "react";
import { ExpenseContext } from "../Context";
import RecordCard from "./RecordCard";
import EmptyState from "./EmptyState";

const NotFound = () => {
  const { resetFilters } = useContext(ExpenseContext);

  return (
    <div className="bg-white rounded-3xl p-12 text-center border border-[#111827]/10 max-w-md mx-auto">
      <div className="w-36 h-36 mx-auto mb-5 rounded-full bg-[#FFF5E6] flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-[#80A1C1]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-[#111827]">Not Found</h3>
      <p className="text-sm text-[#6B7280] mt-2 mb-6">
        No expense transactions matched your search query or filter criteria.
      </p>
      <button
        onClick={resetFilters}
        className="inline-flex items-center gap-2 bg-[#FFF5E6] hover:bg-[#FAD4C0] text-[#111827] border border-[#111827]/15 px-4 py-2 rounded-xl font-semibold text-xs transition-all cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>Clear Search & Filters</span>
      </button>
    </div>
  );
};

const RecordList = () => {
  const { expenses, filteredExpenses } = useContext(ExpenseContext);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#111827]">Transactions & Records</h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#80A1C1]/20 text-[#111827]">
            {filteredExpenses.length} Records
          </span>
        </div>
        <div className="text-xs text-[#6B7280]">
          Click pencil to edit, trash to delete
        </div>
      </div>

      {filteredExpenses.length > 0 ? (
        filteredExpenses.map((expense) => (
          <RecordCard key={expense.id} expense={expense} />
        ))
      ) : expenses.length > 0 ? (
        <div className="flex justify-center w-full">
          <NotFound />
        </div>
      ) : (
        <div className="flex justify-center w-full">
          <EmptyState />
        </div>
      )}
    </section>
  );
};

export default RecordList;