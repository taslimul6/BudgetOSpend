import { useMemo } from "react";
import { useExpenses } from "./Context";
import { computeTotals } from "./Context/selectors";
import { EXPENSE_CATEGORIES } from "./constants/categories";
import { formatMoney } from "./utils/format";

const CatStats = () => {
  const { monthExpenses, settings } = useExpenses();
  const { byCategory } = useMemo(() => computeTotals(monthExpenses), [monthExpenses]);

  return (
    <section className="bg-card rounded-3xl p-6 border border-ink/10 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-bold text-ink">Category Spending Overview</h2>
          <p className="text-xs text-muted">Expense distribution for the selected period</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3" id="categoryOverviewGrid">
        {EXPENSE_CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            className="p-3 bg-bg rounded-2xl border border-ink/5 flex flex-col justify-between"
          >
            <span className="text-xs text-muted font-medium">
              {cat.icon} {cat.name}
            </span>
            <span
              className="text-sm font-bold font-mono text-ink mt-1"
              id={`cat-${cat.name.toLowerCase()}-total`}
            >
              {formatMoney(byCategory[cat.name] || 0, settings.currency)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CatStats;
