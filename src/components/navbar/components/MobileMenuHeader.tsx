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
    className="sticky top-0 bg-gray-200 p-4 z-20"
    style={{
      borderBottom: activeSubmenu ? "none" : "1px solid rgb(229, 231, 235)",
    }}
  >
    {activeSubmenu ? (
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Volver">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">{activeSubmenu}</h1>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Cerrar menú">
          <X className="w-6 h-6" />
        </button>
      </div>
    ) : (
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <SearchBar value={searchQuery} onChange={onSearchChange} onSubmit={onSearchSubmit} />
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Cerrar menú">
          <X className="w-6 h-6" />
        </button>
      </div>
    )}
  </div>
);
