import { useExpenses } from "./Context";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "./constants/categories";
import MonthPicker from "./Components/MonthPicker";
import SearchInput from "./Components/SearchInput";
import { ChevronDownIcon, RefreshIcon } from "./Components/Icons";

const TYPE_OPTIONS = [
  { key: "All", label: "All" },
  { key: "expense", label: "Expenses" },
  { key: "income", label: "Income" },
];

const Filter = () => {
  const {
    typeFilter,
    setTypeFilter,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    resetFilters,
  } = useExpenses();

  const visibleCategories =
    typeFilter === "expense"
      ? EXPENSE_CATEGORIES
      : typeFilter === "income"
        ? INCOME_CATEGORIES
        : [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  const pills = [{ name: "All", icon: "" }, ...visibleCategories];

  const pillClass = (active) =>
    `px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
      active
        ? "bg-primary text-on-primary shadow-sm"
        : "bg-bg hover:bg-primary/10 text-ink border border-ink/10"
    }`;

  return (
    <section className="bg-card rounded-3xl p-5 sm:p-6 border border-ink/10 shadow-sm space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <MonthPicker />

        <div role="group" aria-label="Type" className="flex items-center gap-1 p-1 bg-bg rounded-xl self-start">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              aria-pressed={typeFilter === opt.key}
              onClick={() => setTypeFilter(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                typeFilter === opt.key ? "bg-card text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="block md:hidden">
        <SearchInput
          id="mobileSearchInput"
          placeholder="Search by title, note or category..."
          className="py-2 bg-bg/60 border border-ink/15"
        />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div
          className="flex flex-wrap items-center gap-1.5"
          id="categoryFilterContainer"
        >
          {pills.map((cat) => (
            <button
              key={cat.name}
              type="button"
              aria-pressed={selectedCategory === cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={pillClass(selectedCategory === cat.name)}
            >
              {cat.icon && <span className="mr-1">{cat.icon}</span>}
              {cat.name === "All" ? "All Categories" : cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 self-end lg:self-auto">
          <label className="flex items-center gap-2 text-xs text-muted">
            <span className="font-medium whitespace-nowrap">Sort by:</span>
            <div className="relative">
              <select
                id="sortBySelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-bg border border-ink/15 text-ink text-xs font-semibold rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="date-desc">Date: Newest First</option>
                <option value="date-asc">Date: Oldest First</option>
                <option value="amount-desc">Amount: High to Low</option>
                <option value="amount-asc">Amount: Low to High</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-ink">
                <ChevronDownIcon />
              </div>
            </div>
          </label>
          <button
            type="button"
            id="resetFiltersBtn"
            onClick={resetFilters}
            aria-label="Reset filters and sorting"
            title="Reset filters and sorting"
            className="p-2 rounded-xl bg-bg hover:bg-primary/10 text-ink border border-ink/10 transition-all cursor-pointer"
          >
            <RefreshIcon />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Filter;
