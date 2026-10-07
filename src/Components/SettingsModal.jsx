import { useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useExpenses } from "../Context";
import { CURRENCIES } from "../constants/settings";
import { downloadFile, expensesToCSV } from "../utils/csv";
import { normalizeExpenses } from "../utils/normalize";
import { todayISO } from "../utils/date";
import Modal from "./Modal";
import ConfirmDialog from "./ConfirmDialog";
import { ChevronDownIcon, DownloadIcon, GearIcon, UploadIcon } from "./Icons";

const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

const sectionTitle = "text-xs font-semibold text-ink uppercase tracking-wider mb-2";
const inputClass =
  "w-full px-4 py-2.5 bg-bg/40 border border-ink/15 rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent focus:bg-card transition-all";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-ink bg-bg hover:bg-primary/40 border border-ink/10 transition-colors cursor-pointer";

const SettingsModal = () => {
  const { settings, expenses, updateSettings, closeSettings, importExpenses } = useExpenses();

  const [budget, setBudget] = useState(String(settings.budgetLimit));
  const [currency, setCurrency] = useState(settings.currency);
  const [budgetError, setBudgetError] = useState("");
  const [pendingReplace, setPendingReplace] = useState(null);

  const fileInput = useRef(null);
  const importMode = useRef("merge");

  const handleSave = (event) => {
    event.preventDefault();
    const value = Number(budget);
    if (!budget.trim() || !Number.isFinite(value) || value <= 0) {
      setBudgetError("Budget must be greater than 0");
      return;
    }
    updateSettings({ budgetLimit: value, currency });
    toast.success("Settings saved!");
    closeSettings();
  };

  const exportJSON = () => {
    downloadFile(
      `budgetospend-${todayISO()}.json`,
      JSON.stringify({ version: 1, expenses, settings }, null, 2),
      "application/json"
    );
  };

  const exportCSV = () => {
    downloadFile(`budgetospend-${todayISO()}.csv`, expensesToCSV(expenses), "text/csv");
  };

  const startImport = (mode) => {
    importMode.current = mode;
    fileInput.current?.click();
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.size > MAX_IMPORT_BYTES) {
      toast.error("File is too large (max 5 MB).");
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      toast.error("That file is not valid JSON.");
      return;
    }

    const rawList = Array.isArray(parsed) ? parsed : parsed?.expenses;
    if (!Array.isArray(rawList)) {
      toast.error("No expenses found in that file.");
      return;
    }

    const valid = normalizeExpenses(rawList);
    const skipped = rawList.length - valid.length;
    if (valid.length === 0) {
      toast.error("No valid records found in that file.");
      return;
    }

    if (importMode.current === "replace") {
      setPendingReplace({ valid, skipped });
    } else {
      finishImport(valid, skipped, "merge");
    }
  };

  const finishImport = (valid, skipped, mode) => {
    importExpenses(valid, mode);
    toast.success(
      `Imported ${valid.length} record${valid.length === 1 ? "" : "s"}` +
        (skipped ? ` (${skipped} skipped)` : "")
    );
    setPendingReplace(null);
  };

  return (
    <Modal
      title="Settings"
      subtitle="Budget, currency and your data"
      icon={<GearIcon className="h-5 w-5" />}
      onClose={closeSettings}
    >
      <form className="space-y-4" onSubmit={handleSave} noValidate>
        <div>
          <label htmlFor="budgetLimit" className={sectionTitle}>
            Monthly budget limit
          </label>
          <input
            id="budgetLimit"
            type="number"
            min="1"
            step="any"
            data-autofocus
            value={budget}
            aria-invalid={Boolean(budgetError)}
            onChange={(e) => {
              setBudget(e.target.value);
              setBudgetError("");
            }}
            className={inputClass}
          />
          {budgetError && (
            <p role="alert" className="mt-1 text-xs text-danger">
              {budgetError}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="currency" className={sectionTitle}>
            Currency
          </label>
          <div className="relative">
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              {Object.entries(CURRENCIES).map(([code, { label }]) => (
                <option key={code} value={code}>
                  {label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-ink">
              <ChevronDownIcon />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-on-primary bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all shadow-sm border border-ink/10 cursor-pointer"
          >
            Save settings
          </button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-ink/10 space-y-4">
        <div>
          <h4 className={sectionTitle}>Export</h4>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={exportJSON} className={secondaryButton}>
              <DownloadIcon /> JSON (full backup)
            </button>
            <button type="button" onClick={exportCSV} className={secondaryButton}>
              <DownloadIcon /> CSV (spreadsheet)
            </button>
          </div>
        </div>

        <div>
          <h4 className={sectionTitle}>Import JSON backup</h4>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => startImport("merge")} className={secondaryButton}>
              <UploadIcon /> Import &amp; merge
            </button>
            <button type="button" onClick={() => startImport("replace")} className={secondaryButton}>
              <UploadIcon /> Import &amp; replace all
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">
            Merge keeps your current records and skips ones that already exist.
          </p>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            aria-label="Import file"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </div>

      <AnimatePresence>
        {pendingReplace && (
          <ConfirmDialog
            key="replace"
            title="Replace all records?"
            message={`This will remove your ${expenses.length} current record${
              expenses.length === 1 ? "" : "s"
            } and load ${pendingReplace.valid.length} from the file.`}
            confirmLabel="Replace"
            onCancel={() => setPendingReplace(null)}
            onConfirm={() => finishImport(pendingReplace.valid, pendingReplace.skipped, "replace")}
          />
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default SettingsModal;
