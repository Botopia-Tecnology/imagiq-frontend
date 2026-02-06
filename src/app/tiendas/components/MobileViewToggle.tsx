"use client";

import type { ViewMode } from "../hooks/useViewMode";

interface MobileViewToggleProps {
  currentView: ViewMode;
  onToggle: () => void;
}

export default function MobileViewToggle({ currentView, onToggle }: MobileViewToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
                 bg-green-600 text-white rounded-full px-8 py-4
                 border-2 border-black
                 shadow-lg shadow-green-500/40
                 hover:bg-green-700 hover:border-green-600
                 hover:shadow-xl hover:shadow-green-500/50
                 active:scale-95 transition-all duration-200
                 flex items-center gap-3 font-bold text-[17px]"
      style={{
        fontFamily: "Samsung Sharp Sans, sans-serif",
      }}
      aria-label={currentView === "map" ? "Ver lista de tiendas" : "Ver mapa"}
    >
      {currentView === "map" ? (
        <>
          <ListIcon />
          <span>Ver Lista</span>
        </>
      ) : (
        <>
          <MapIcon />
          <span>Ver Mapa</span>
        </>
      )}
    </button>
  );
}

function ListIcon() {
  return (
    <svg
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1.5" fill="currentColor" />
      <circle cx="4" cy="12" r="1.5" fill="currentColor" />
      <circle cx="4" cy="18" r="1.5" fill="currentColor" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
    >
      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
