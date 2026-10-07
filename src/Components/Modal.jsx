import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { m } from "framer-motion";
import { CloseIcon } from "./Icons";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// Only the top-most open modal reacts to the keyboard.
const openModals = [];

/**
 * Accessible dialog shell: role="dialog", Esc to close, backdrop click to close,
 * Tab focus trap, body scroll lock, and focus restored to the opener on unmount.
 * Render it inside <AnimatePresence> for the exit animation.
 */
const Modal = ({ title, subtitle, icon, onClose, children, widthClass = "max-w-lg" }) => {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const target = dialog.querySelector("[data-autofocus]") || dialog.querySelector(FOCUSABLE);
    target?.focus();

    const token = {};
    openModals.push(token);

    const onKeyDown = (event) => {
      if (openModals[openModals.length - 1] !== token) return;
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;

      const items = Array.from(dialog.querySelectorAll(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      openModals.splice(openModals.indexOf(token), 1);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) {
        previouslyFocused.focus();
      }
    };
  }, []);

  return createPortal(
    <m.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <m.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`bg-card text-ink rounded-3xl ${widthClass} w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-ink/15 shadow-2xl`}
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.18 }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-ink/10 mb-6">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-2xl bg-bg text-ink flex items-center justify-center border border-ink/10">
                {icon}
              </div>
            )}
            <div>
              <h3 id={titleId} className="text-lg font-bold text-ink">
                {title}
              </h3>
              {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-xl bg-bg hover:bg-primary/60 text-ink flex items-center justify-center transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </m.div>
    </m.div>,
    document.body
  );
};

export default Modal;
