import Modal from "./Modal";
import { TrashIcon } from "./Icons";

const ConfirmDialog = ({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}) => (
  <Modal
    title={title}
    icon={<TrashIcon className="h-5 w-5 text-danger" />}
    onClose={onCancel}
    widthClass="max-w-sm"
  >
    <p className="text-sm text-muted mb-6">{message}</p>
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        data-autofocus
        onClick={onCancel}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-ink bg-bg hover:bg-primary/40 transition-colors cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#DC2626] hover:bg-[#b91c1c] active:scale-[0.98] transition-all cursor-pointer"
      >
        {confirmLabel}
      </button>
    </div>
  </Modal>
);

export default ConfirmDialog;
