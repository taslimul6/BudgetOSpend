import { useExpenses } from "../Context";
import { PlusIcon } from "../Components/Icons";

const EmptyState = () => {
  const { openModalForNew } = useExpenses();

  return (
    <div className="bg-card rounded-3xl p-12 text-center border border-dashed border-ink/20 shadow-sm max-w-md w-full">
      <div className="w-36 h-36 mx-auto mb-5 rounded-full bg-bg flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-ink">List is empty!</h3>
      <p className="text-sm text-muted mt-2 mb-6">
        You haven't recorded any transactions yet. Keep your finances organized by adding your first one.
      </p>
      <button
        type="button"
        onClick={openModalForNew}
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-on-primary px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm border border-ink/10 cursor-pointer"
      >
        <PlusIcon />
        <span>Add First Transaction</span>
      </button>
    </div>
  );
};

export default EmptyState;
