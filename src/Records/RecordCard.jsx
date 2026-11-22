import { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { toast } from "react-toastify";
import { useExpenses } from "../Context";
import { getCategory } from "../constants/categories";
import { formatDate } from "../utils/date";
import { formatMoney } from "../utils/format";
import ConfirmDialog from "../Components/ConfirmDialog";
import { CalendarIcon, PencilIcon, RepeatIcon, TrashIcon } from "../Components/Icons";

const UndoToast = ({ message, onUndo, closeToast }) => (
  <div className="flex items-center justify-between gap-3">
    <span>{message}</span>
    <button
      type="button"
      onClick={() => {
        onUndo();
        closeToast?.();
      }}
      className="font-bold underline underline-offset-2 cursor-pointer"
    >
      Undo
    </button>
  </div>
);

const RecordCard = ({ expense }) => {
  const { openModalForEdit, deleteExpense, restoreExpense, settings } = useExpenses();
  const [confirming, setConfirming] = useState(false);

  const category = getCategory(expense.category);
  const isIncome = expense.type === "income";

  const handleConfirmDelete = () => {
    setConfirming(false);
    deleteExpense(expense.id);
    toast(
      ({ closeToast }) => (
        <UndoToast
          message="Transaction deleted."
          onUndo={() => restoreExpense(expense)}
          closeToast={closeToast}
        />
      ),
      { autoClose: 6000 }
    );
  };

  return (
    <m.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.2 }}
      className="list-none"
    >
      <div className="bg-card rounded-2xl p-4 sm:p-5 border border-ink/10 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: item info */}
        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 border"
            style={{ backgroundColor: `${category.color}33`, borderColor: `${category.color}66` }}
          >
            {category.icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h4 className="text-sm sm:text-base font-bold text-ink truncate">{expense.title}</h4>
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-ink border"
                style={{ backgroundColor: `${category.color}33`, borderColor: `${category.color}66` }}
              >
                {expense.category}
              </span>
              {(expense.recurring || expense.recurringSourceId) && (
                <span
                  title={expense.recurring ? "Repeats every month" : "Created from a monthly repeat"}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-accent/15 text-ink border border-accent/30"
                >
                  <RepeatIcon className="h-3 w-3" />
                  {expense.recurring ? "Monthly" : "Auto"}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                {formatDate(expense.date)}
              </span>
              {expense.description && (
                <span className="hidden sm:inline-block truncate max-w-xs">
                  • {expense.description}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-ink/5">
          <span
            className={`text-base sm:text-lg font-bold font-mono tracking-tight ${
              isIncome ? "text-success" : "text-ink"
            }`}
          >
            {isIncome ? "+" : ""}
            {formatMoney(expense.amount, settings.currency)}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => openModalForEdit(expense)}
              title="Edit"
              aria-label={`Edit ${expense.title}`}
              className="p-2 rounded-xl bg-bg hover:bg-primary/15 text-ink border border-ink/10 transition-colors cursor-pointer"
            >
              <PencilIcon />
            </button>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              title="Delete"
              aria-label={`Delete ${expense.title}`}
              className="p-2 rounded-xl bg-bg hover:bg-danger/15 hover:text-danger text-ink border border-ink/10 transition-colors cursor-pointer"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {confirming && (
          <ConfirmDialog
            title="Delete transaction?"
            message={`"${expense.title}" will be removed. You can undo this right after.`}
            onCancel={() => setConfirming(false)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>
    </m.li>
  );
};

export default RecordCard;
