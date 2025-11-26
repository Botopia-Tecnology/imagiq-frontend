"use client";

import { X, ChevronLeft } from "lucide-react";
import { SearchBar } from "./SearchBar";
import type { FC, FormEvent } from "react";

type Props = {
  activeSubmenu: string | null;
  onClose: () => void;
  onBack: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: FormEvent) => void;
};

export const MobileMenuHeader: FC<Props> = ({
  activeSubmenu,
  onClose,
  onBack,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => (
  <div
    className="sticky top-0 bg-white z-20"
  >
    {activeSubmenu ? (
      <div className="flex items-center justify-between p-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Volver">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">{activeSubmenu}</h1>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Cerrar menú">
          <X className="w-6 h-6" />
        </button>
      </div>
    ) : (
      <div className="flex items-center justify-end p-4 pb-0">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Cerrar menú">
          <X className="w-6 h-6" />
        </button>
      </div>
    )}
  </div>
);
