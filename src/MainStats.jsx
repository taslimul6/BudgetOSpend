import { useMemo } from "react";
import { useExpenses } from "./Context";
import { ALL_MONTHS, computeTotals, countMonths } from "./Context/selectors";
import { daysLeftInMonth, formatMonth } from "./utils/date";
import { formatMoney } from "./utils/format";
import { TrendUpIcon, WalletIcon } from "./Components/Icons";

const cardClass =
  "bg-card rounded-3xl p-6 border border-ink/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between";
const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted";

const MainStats = () => {
  const { monthExpenses, selectedMonth, settings } = useExpenses();
  const { currency, budgetLimit } = settings;
  const isAll = selectedMonth === ALL_MONTHS;

  const totals = useMemo(() => computeTotals(monthExpenses), [monthExpenses]);

  const budgetTotal = budgetLimit * (isAll ? countMonths(monthExpenses) : 1);
  const remaining = budgetTotal - totals.expense;
  const spentPercentage = (totals.expense / budgetTotal) * 100;
  const isOverBudget = remaining < 0;

  const level = spentPercentage >= 100 ? "danger" : spentPercentage >= 80 ? "warning" : "success";
  const barColor = { danger: "bg-danger", warning: "bg-warning", success: "bg-success" }[level];
  const statusMessage = {
    danger: "Over budget!",
    warning: "Approaching limit",
    success: "Healthy spending pace",
  }[level];

  const daysLeft = isAll ? null : daysLeftInMonth(selectedMonth);
  const periodLabel = isAll
    ? "All time"
    : daysLeft !== null
      ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`
      : formatMonth(selectedMonth);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Expenses */}
      <div className={cardClass}>
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/30 rounded-full blur-2xl pointer-events-none" />
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className={labelClass}>Total Expense</span>
            <span className="p-2 rounded-xl bg-bg text-warning">
              <WalletIcon className="h-5 w-5" />
            </span>
          </div>
          <div
            className="text-3xl font-extrabold font-mono text-ink tracking-tight"
            id="totalExpenseDisplay"
          >
            {formatMoney(totals.expense, currency)}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1 font-medium">
            <TrendUpIcon className="h-3.5 w-3.5" />
            <span id="totalEntriesDisplay">
              {totals.expenseCount} {totals.expenseCount === 1 ? "entry" : "entries"}
            </span>
          </span>
          <span>{isAll ? "All time" : formatMonth(selectedMonth)}</span>
        </div>
      </div>

      {/* Income & balance */}
      <div className={cardClass}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className={labelClass}>Income</span>
            <span className="p-2 rounded-xl bg-accent/15 text-accent">
              <TrendUpIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="text-3xl font-extrabold font-mono text-success tracking-tight" id="totalIncomeDisplay">
            {formatMoney(totals.income, currency)}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between text-xs text-muted">
          <span>Balance</span>
          <span
            id="balanceDisplay"
            className={`font-mono font-semibold ${totals.balance < 0 ? "text-danger" : "text-ink"}`}
          >
            {formatMoney(totals.balance, currency)}
          </span>
        </div>
      </div>

      {/* Budget */}
      <div className="bg-linear-to-br from-bg to-primary/30 rounded-3xl p-6 border border-ink/10 shadow-sm hover:shadow-md transition-shadow lg:col-span-2 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div>
            <span className={labelClass}>{isAll ? "Budget (all months)" : "Monthly Budget Target"}</span>
            <h3 className="text-xl font-bold text-ink mt-0.5">
              {formatMoney(budgetTotal, currency)} Limit
            </h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted">Remaining</span>
            <p
              className={`text-lg font-bold font-mono ${isOverBudget ? "text-danger" : "text-success"}`}
              id="budgetRemainingDisplay"
            >
              {formatMoney(remaining, currency)}
            </p>
          </div>
        </div>

        <div className="my-4">
          <div className="flex items-center justify-between text-xs font-medium text-ink mb-1.5">
            <span>Spent: {spentPercentage.toFixed(1)}%</span>
            <span>Limit: {formatMoney(budgetTotal, currency)}</span>
          </div>
          <div
            role="progressbar"
            aria-label="Budget used"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.min(Math.round(spentPercentage), 100)}
            className="w-full bg-card/70 h-3 rounded-full overflow-hidden p-0.5 border border-ink/10"
          >
            <div
              id="budgetProgressBar"
              className={`${barColor} h-full rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(spentPercentage, 100).toFixed(1)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted pt-2 border-t border-ink/10">
          <span className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${barColor}`} />
            {statusMessage}
          </span>
          <span className="font-medium">{periodLabel}</span>
        </div>
      </div>
    </section>
  );
};

export default MainStats;
