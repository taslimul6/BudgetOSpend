import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useExpenses } from "../Context";
import { ALL_MONTHS } from "../Context/selectors";
import { PAGE_SIZE } from "../constants/settings";
import { formatMonth } from "../utils/date";
import RecordCard from "./RecordCard";
import EmptyState from "./EmptyState";
import { PlusIcon, RefreshIcon, SearchIcon } from "../Components/Icons";

const actionButton =
  "inline-flex items-center gap-2 bg-bg hover:bg-primary/15 text-ink border border-ink/15 px-4 py-2 rounded-xl font-semibold text-xs transition-all cursor-pointer";

const NoResults = ({ hasMonthData }) => {
  const { resetFilters, selectedMonth, setSelectedMonth, openModalForNew } = useExpenses();

  return (
    <div className="bg-card rounded-3xl p-12 text-center border border-ink/10 max-w-md mx-auto">
      <div className="w-36 h-36 mx-auto mb-5 rounded-full bg-bg flex items-center justify-center">
        <SearchIcon className="h-16 w-16 text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-ink">Not Found</h3>
      <p className="text-sm text-muted mt-2 mb-6">
        {hasMonthData
          ? "No transactions matched your search query or filter criteria."
          : `Nothing recorded for ${formatMonth(selectedMonth)} yet.`}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {hasMonthData ? (
          <button type="button" onClick={resetFilters} className={actionButton}>
            <RefreshIcon /> Clear Search &amp; Filters
          </button>
        ) : (
          <>
            <button type="button" onClick={openModalForNew} className={actionButton}>
              <PlusIcon className="h-4 w-4" /> Add Transaction
            </button>
            <button type="button" onClick={() => setSelectedMonth(ALL_MONTHS)} className={actionButton}>
              Show all time
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Remounted (via `key`) whenever the filters change, which resets pagination.
const PagedList = ({ items }) => {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = items.slice(0, visible);
  const remaining = items.length - shown.length;

  return (
    <>
      <ul id="expenseListContainer" className="space-y-3">
        <AnimatePresence initial={false}>
          {shown.map((expense) => (
            <RecordCard key={expense.id} expense={expense} />
          ))}
        </AnimatePresence>
      </ul>
      {remaining > 0 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className={actionButton}
          >
            Load more ({remaining} remaining)
          </button>
        </div>
      )}
    </>
  );
};

const RecordList = () => {
  const {
    expenses,
    monthExpenses,
    filteredExpenses,
    selectedMonth,
    typeFilter,
    selectedCategory,
    searchQuery,
    sortBy,
  } = useExpenses();

  const listKey = [selectedMonth, typeFilter, selectedCategory, searchQuery, sortBy].join("|");

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-ink">Transactions &amp; Records</h2>
          <span
            id="filteredCountNotice"
            role="status"
            className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-ink"
          >
            {filteredExpenses.length} Records
          </span>
        </div>
        <div className="text-xs text-muted hidden sm:block">Click pencil to edit, trash to delete</div>
      </div>

      {filteredExpenses.length > 0 ? (
        <PagedList key={listKey} items={filteredExpenses} />
      ) : expenses.length > 0 ? (
        <div className="flex justify-center w-full">
          <NoResults hasMonthData={monthExpenses.length > 0} />
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
