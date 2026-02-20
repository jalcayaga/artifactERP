import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "left" | "right";
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  side = "right",
}) => {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (typeof document === "undefined" || !mounted) {
    return null;
  }

  const drawer = (
    <>
      <div
        className={`fixed inset-0 z-50 bg-slate-900/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed top-0 z-[60] h-full w-full max-w-sm transition-transform duration-300 ease-in-out ${side === "right" ? "right-0" : "left-0"
          } ${isOpen
            ? "translate-x-0"
            : side === "right"
              ? "translate-x-full"
              : "-translate-x-full"
          }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative flex h-full flex-col overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            aria-label="Cerrar"
          >
            <span className="block h-5 w-5">×</span>
          </button>
          {children}
        </div>
      </aside>
    </>
  );

  return createPortal(drawer, document.body);
};

export default Drawer;
