import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useExpenses } from "../Context";
import { categoriesForType } from "../constants/categories";
import { expenseFormSchema } from "../utils/expenseSchema";
import { toMonthKey, todayISO } from "../utils/date";
import { currencySymbol } from "../utils/format";
import { newId } from "../utils/id";
import Modal from "./Modal";
import { ChevronDownIcon, CoinIcon, RepeatIcon } from "./Icons";

const labelClass = "block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5";
const fieldClass =
  "w-full px-4 py-2.5 bg-bg/40 border rounded-xl text-sm text-ink focus:outline-none focus:ring-2 focus:bg-card transition-all";

const fieldState = (error) =>
  `${fieldClass} ${error ? "border-danger focus:ring-danger" : "border-ink/15 focus:ring-accent"}`;

const FieldError = ({ error }) =>
  error ? (
    <p role="alert" className="mt-1 text-xs text-danger">
      {error.message}
    </p>
  ) : null;

const ExpenseModal = () => {
  const { editExpense, closeModal, addExpense, updateExpense, settings } = useExpenses();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: editExpense
      ? {
          type: editExpense.type,
          title: editExpense.title,
          amount: String(editExpense.amount),
          category: editExpense.category,
          date: editExpense.date,
          description: editExpense.description,
          recurring: editExpense.recurring,
        }
      : {
          type: "expense",
          title: "",
          amount: "",
          category: "",
          date: todayISO(),
          description: "",
          recurring: false,
        },
  });

  const type = useWatch({ control, name: "type" });
  const categories = categoriesForType(type);
  const symbol = currencySymbol(settings.currency);

  const switchType = (next) => {
    if (next === type) return;
    setValue("type", next);
    setValue("category", "");
  };

  const onSubmit = (values) => {
    const keepsProgress =
      editExpense?.recurring &&
      values.recurring &&
      editExpense.lastGenerated &&
      toMonthKey(editExpense.date) === toMonthKey(values.date);

    const expense = {
      id: editExpense?.id ?? newId(),
      type: values.type,
      title: values.title.trim(),
      amount: Math.round(Number(values.amount) * 100) / 100,
      category: values.category,
      date: values.date,
      description: values.description.trim(),
      recurring: values.recurring,
      ...(keepsProgress ? { lastGenerated: editExpense.lastGenerated } : {}),
      ...(editExpense?.recurringSourceId
        ? { recurringSourceId: editExpense.recurringSourceId }
        : {}),
    };

    const noun = expense.type === "income" ? "Income" : "Expense";
    if (editExpense) {
      updateExpense(expense);
      toast.success(`${noun} updated successfully!`);
    } else {
      addExpense(expense);
      toast.success(`${noun} added successfully!`);
    }
    closeModal();
  };

  return (
    <Modal
      title={editExpense ? "Edit Transaction" : "Add New Transaction"}
      subtitle={
        editExpense ? "Update your transaction details" : "Enter details to record this transaction"
      }
      icon={<CoinIcon className="h-5 w-5" />}
      onClose={closeModal}
    >
      <form id="expenseForm" className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Type */}
        <div role="group" aria-label="Transaction type" className="grid grid-cols-2 gap-2 p-1 bg-bg rounded-xl">
          {["expense", "income"].map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              onClick={() => switchType(t)}
              className={`py-2 rounded-lg text-sm font-semibold capitalize transition-all cursor-pointer ${
                type === t ? "bg-card text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Title */}
        <div>
          <label htmlFor="expenseTitle" className={labelClass}>
            Title <span className="text-danger">*</span>
          </label>
          <input
            id="expenseTitle"
            type="text"
            data-autofocus
            placeholder="e.g. Grocery shopping, House rent, Salary"
            aria-invalid={Boolean(errors.title)}
            className={fieldState(errors.title)}
            {...register("title")}
          />
          <FieldError error={errors.title} />
        </div>

        {/* Amount + Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="expenseAmount" className={labelClass}>
              Amount ({symbol}) <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-muted font-mono text-sm font-semibold">
                {symbol}
              </span>
              <input
                id="expenseAmount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                aria-invalid={Boolean(errors.amount)}
                className={`${fieldState(errors.amount)} pl-8`}
                {...register("amount")}
              />
            </div>
            <FieldError error={errors.amount} />
          </div>

          <div>
            <label htmlFor="expenseCategory" className={labelClass}>
              Category <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <select
                id="expenseCategory"
                aria-invalid={Boolean(errors.category)}
                className={`${fieldState(errors.category)} appearance-none cursor-pointer`}
                {...register("category")}
              >
                <option value="" disabled>
                  Select category
                </option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-ink">
                <ChevronDownIcon />
              </div>
            </div>
            <FieldError error={errors.category} />
          </div>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="expenseDate" className={labelClass}>
            Date <span className="text-danger">*</span>
          </label>
          <input
            id="expenseDate"
            type="date"
            aria-invalid={Boolean(errors.date)}
            className={fieldState(errors.date)}
            {...register("date")}
          />
          <FieldError error={errors.date} />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="expenseNote" className={labelClass}>
            Note / Description{" "}
            <span className="text-xs font-normal text-muted lowercase">(optional)</span>
          </label>
          <textarea
            id="expenseNote"
            rows="2"
            placeholder="Add brief details about this transaction..."
            aria-invalid={Boolean(errors.description)}
            className={`${fieldState(errors.description)} resize-none`}
            {...register("description")}
          />
          <FieldError error={errors.description} />
        </div>

        {/* Recurring */}
        <label className="flex items-start gap-3 p-3 rounded-xl bg-bg/60 border border-ink/10 cursor-pointer">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#80A1C1]" {...register("recurring")} />
          <span className="text-sm text-ink">
            <span className="flex items-center gap-1.5 font-semibold">
              <RepeatIcon className="h-4 w-4" /> Repeat every month
            </span>
            <span className="block text-xs text-muted">
              A copy is added automatically on the same day each month.
            </span>
          </span>
        </label>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-ink/10">
          <button
            type="button"
            onClick={closeModal}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-ink bg-bg hover:bg-primary/40 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="submitExpenseBtn"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-on-primary bg-primary hover:bg-primary-hover active:scale-[0.98] transition-all shadow-sm border border-ink/10 cursor-pointer"
          >
            {editExpense ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseModal;
