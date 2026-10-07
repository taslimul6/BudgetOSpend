import { useExpenses } from "../Context";
import { ALL_MONTHS } from "../Context/selectors";
import { addMonths, formatMonth, todayISO, toMonthKey } from "../utils/date";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "./Icons";

const navButton =
  "w-9 h-9 rounded-xl bg-bg hover:bg-primary/40 text-ink border border-ink/10 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

const MonthPicker = () => {
  const { selectedMonth, setSelectedMonth } = useExpenses();
  const isAll = selectedMonth === ALL_MONTHS;
  const month = isAll ? toMonthKey(todayISO()) : selectedMonth;

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Month">
      <button
        type="button"
        aria-label="Previous month"
        disabled={isAll}
        onClick={() => setSelectedMonth(addMonths(month, -1))}
        className={navButton}
      >
        <ChevronLeftIcon />
      </button>

      <label className="relative flex items-center gap-2 px-3 h-9 rounded-xl bg-bg border border-ink/10 text-sm font-semibold text-ink min-w-40 justify-center cursor-pointer">
        <CalendarIcon className="h-4 w-4 text-muted" />
        <span>{isAll ? "All time" : formatMonth(selectedMonth)}</span>
        <input
          type="month"
          aria-label="Choose month"
          value={isAll ? "" : selectedMonth}
          onChange={(e) => e.target.value && setSelectedMonth(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </label>

      <button
        type="button"
        aria-label="Next month"
        disabled={isAll}
        onClick={() => setSelectedMonth(addMonths(month, 1))}
        className={navButton}
      >
        <ChevronRightIcon />
      </button>

      <button
        type="button"
        aria-pressed={isAll}
        onClick={() => setSelectedMonth(isAll ? toMonthKey(todayISO()) : ALL_MONTHS)}
        className={`h-9 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
          isAll
            ? "bg-ink text-bg border-ink"
            : "bg-bg text-ink border-ink/10 hover:bg-primary/40"
        }`}
      >
        All time
      </button>
    </div>
  );
};

export default MonthPicker;
