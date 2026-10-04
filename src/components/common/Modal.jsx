import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";

export function Modal({ title, onClose, children, wide = false }) {
  const panel = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector("button,input,textarea")?.focus();
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const items = [
        ...panel.current.querySelectorAll(
          'button:not(:disabled),input:not(:disabled),textarea,select,[tabindex="0"]',
        ),
      ].filter((el) => el.getClientRects().length);
      if (!items.length) return;
      if (e.shiftKey && document.activeElement === items[0]) {
        e.preventDefault();
        items.at(-1).focus();
      } else if (!e.shiftKey && document.activeElement === items.at(-1)) {
        e.preventDefault();
        items[0].focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        ref={panel}
        className={`modal ${wide ? "wide-modal" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="modal-header">
          <h2 id="dialog-title">{title}</h2>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
