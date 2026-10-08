import Logo from "./assets/logo.svg";
import { useExpenses } from "./Context";
import SearchInput from "./Components/SearchInput";
import { GearIcon, MoonIcon, PlusIcon, SunIcon } from "./Components/Icons";

const iconButton =
  "w-10 h-10 rounded-xl bg-card hover:bg-primary/40 text-ink border border-ink/10 flex items-center justify-center transition-colors cursor-pointer";

const Navbar = () => {
  const { openModalForNew, openSettings, toggleTheme, settings } = useExpenses();
  const isDark = settings.theme === "dark";

  return (
    <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-md border-b border-ink/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#111827] flex items-center justify-center shadow-sm p-1.5">
            <img src={Logo} alt="BentoSpend Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-ink">
                Bento<span className="text-accent">Spend</span>
              </h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-primary text-on-primary rounded-full">
                v1.0
              </span>
            </div>
            <p className="text-xs text-muted">Expense &amp; Budget Manager</p>
          </div>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <SearchInput
            id="headerSearchInput"
            placeholder="Search by title, note or category..."
            className="py-2.5 bg-card border border-ink/15 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openModalForNew}
            id="openAddModalBtn"
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover active:scale-[0.98] text-on-primary px-4 sm:px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm border border-ink/10 cursor-pointer"
          >
            <PlusIcon />
            <span>Add</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Light mode" : "Dark mode"}
            className={iconButton}
          >
            {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={openSettings}
            aria-label="Open settings"
            title="Settings"
            className={iconButton}
          >
            <GearIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
