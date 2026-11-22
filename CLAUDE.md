# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server (http://localhost:5173)
- `npm run build` — production build to `dist/` (gitignored)
- `npm run preview` — serve the production build
- `npm run lint` — oxlint (config in `.oxlintrc.json`)
- `npm test` — run all Vitest tests once; `npm run test:watch` for watch mode
- Single file: `npx vitest run src/Context/reducer.test.js`; single test: `npx vitest run -t "adds, updates, deletes"`

CI (`.github/workflows/ci.yml`) runs lint, test and build.

## Architecture

Plain-JavaScript (JSX, no TypeScript) React 19 SPA with Vite and Tailwind CSS v4. No backend or router. Data lives in a `useReducer` and is persisted to `localStorage` under `budgetospend:v1` (`utils/storage.js`).

### State: one context, one reducer (`src/Context/`)

- `reducer.js` holds the reducer and `createInitialState()`. State is `{ expenses, settings, ui, filters }`. Initial state comes from `localStorage`, falling back to `constants/seed.js`.
- `selectors.js` holds the pure derivations. Two scopes matter: `monthExpenses` (only the selected month, or everything for `"all"`) feeds the stats cards, while `filteredExpenses` (month, then type, category and search, then sort) feeds the list.
- `ExpenseProvider.jsx` memoizes the derived lists and the context value, persists state in an effect, and mirrors `settings.theme` onto `<html data-theme>`. Consume it with `useExpenses()` (throws outside the provider). Action creators are stable, so they are safe in effect deps.
- A "transaction" is an `expense` or an `income` record (`type` field). Many names say "expense" for both, e.g. `ExpenseModal`, `addExpense`.

### Data conventions that span files

- **Normalization:** anything from `localStorage` or an imported file goes through `utils/normalize.js` (`normalizeExpense` / `normalizeSettings`). It migrates legacy records (numeric ids, `"Aug 25, 2026"` dates, no `type`) and drops invalid ones. Reuse it for any new data entry point.
- **Dates are ISO `YYYY-MM-DD` strings,** compared as strings and formatted only for display (`utils/date.js`). Avoid `new Date("YYYY-MM-DD")`, which parses as UTC; use the helpers.
- **Ids are strings** (`utils/id.js`, `crypto.randomUUID`).
- **Categories** live only in `constants/categories.js` (name, icon, color per type). Icons and colors are looked up at render time via `getCategory`, not stored on records. Category colors are applied as hex plus alpha suffix so they work in both themes.
- **Recurring entries** (`utils/recurring.js`): a record with `recurring: true` is a template. `applyRecurring` creates one copy per elapsed month (copies carry `recurringSourceId`) and tracks progress in the template's `lastGenerated`, so deleting a copy does not bring it back. It runs on load and inside the `ADD_EXPENSE` / `UPDATE_EXPENSE` / `IMPORT_EXPENSES` reducer cases, and is idempotent.
- **Budget** is `settings.budgetLimit` per month. With the month filter set to "all", the limit is multiplied by the number of months that have records.

### UI layer

- **Theming and brand:** `src/index.css` defines semantic tokens (`--c-bg`, `--c-card`, `--c-ink`, `--c-primary`, ...) with a `[data-theme="dark"]` override, exposed to Tailwind via `@theme inline` as `bg-card`, `text-ink`, `text-muted`, `bg-primary`, `text-on-primary`, etc. Use these tokens, not hardcoded hex, so dark mode keeps working. The brand is an indigo primary on cool neutrals; green, amber and red are reserved for income, warning and danger, so do not use them decoratively. All text/background pairs were checked for WCAG AA, so re-check contrast when changing a token. The budget card is a gradient "hero" (`--c-hero-from/to`) with fixed white text, so it does not use `text-ink`. `index.html` has an inline script that sets the theme before first paint. The product name is BudgetOSpend (wordmark: the `O` is highlighted); `src/assets/logo.svg` is also copied to `public/favicon.svg`.
- **Dialogs:** `Components/Modal.jsx` is the shared shell (portal, `role="dialog"`, Esc, focus trap and restore, scroll lock, only the top-most modal reacts to keys). `ExpenseModal`, `SettingsModal` and `ConfirmDialog` build on it. Render them inside `AnimatePresence` for exit animations.
- **Forms:** `ExpenseModal` uses react-hook-form with the zod schema in `utils/expenseSchema.js`. Form values are strings and are converted on submit.
- **Search** is debounced locally in `Components/SearchInput.jsx` (the navbar and mobile filter each render one) and only then written to context.
- **Animation:** framer-motion is loaded lazily through `LazyMotion` in `App.jsx` (`motionFeatures.js`), so components use `m.*`, not `motion.*`.
- **List:** `Records/RecordList.jsx` paginates 10 at a time, and remounts the paged list via a `key` built from the filters to reset the page. Deleting asks for confirmation (`ConfirmDialog`) and then shows an Undo toast that calls `restoreExpense`.

## Testing

Vitest with jsdom, React Testing Library and user-event. `src/test/setup.js` clears `localStorage` and fakes only `Date`, pinned to 2026-11-22, so timers stay real. Use `renderApp()` and `seedStorage()` from `src/test/renderApp.jsx` for integration tests; the seed data's latest month (August 2026) is the default view because "today" has no records. Pure logic (`utils/`, `Context/reducer.js`, `Context/selectors.js`) has unit tests next to the source.

## Notes

- `README.md` is partly out of date (feature list, structure, a placeholder clone URL); trust the code and `package.json`.
- `.kilo/` holds worktree data for another tool; ignore it.
