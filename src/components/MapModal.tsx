"use client";

import { ReactNode } from "react";

type Props = {
  onClose: () => void;
  children: ReactNode;
};

export default function MapModal({ onClose, children }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative bg-amber-50 rounded-3xl shadow-2xl border-4 border-amber-800 max-w-lg w-full mx-4 p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-amber-900 text-3xl font-bold leading-none hover:text-amber-600 transition-colors"
          aria-label="Fermer"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
