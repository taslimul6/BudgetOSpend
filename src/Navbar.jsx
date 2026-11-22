import Logo from "./assets/logo.svg";
import { useExpenses } from "./Context";
import SearchInput from "./Components/SearchInput";
import { GearIcon, MoonIcon, PlusIcon, SunIcon } from "./Components/Icons";

const iconButton =
  "w-10 h-10 rounded-xl bg-card hover:bg-primary/10 text-ink border border-ink/10 flex items-center justify-center transition-colors cursor-pointer";

const Navbar = () => {
  const { openModalForNew, openSettings, toggleTheme, settings } = useExpenses();
  const isDark = settings.theme === "dark";

  return (
    <header className="sticky top-0 z-30 bg-bg/90 backdrop-blur-md border-b border-ink/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img src={Logo} alt="" className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-xl shadow-sm" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-ink whitespace-nowrap">
                Budget<span className="text-primary">O</span>Spend
              </h1>
            </div>
            <p className="hidden sm:block text-xs text-muted">Expense &amp; Budget Manager</p>
          </div>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <SearchInput
            id="headerSearchInput"
            placeholder="Search by title, note or category..."
            className="py-2.5 bg-card border border-ink/15 shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={openModalForNew}
            id="openAddModalBtn"
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover active:scale-[0.98] text-on-primary w-10 h-10 sm:w-auto sm:h-auto justify-center sm:px-5 sm:py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm border border-ink/10 cursor-pointer"
          >
            <PlusIcon />
            <span className="sr-only sm:not-sr-only">Add</span>
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
