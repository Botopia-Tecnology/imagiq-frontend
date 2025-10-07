"use client";

import { useState } from "react";

const tabs = [
  { name: "Productos", count: 62 },
  { name: "Accesorios", count: 382 },
  { name: "Asistencia técnica", count: 1275 },
  { name: "Otro", count: 187 },
];

export function SearchHeader() {
  const [activeTab, setActiveTab] = useState(2); // Asistencia técnica activo
  const [sortBy, setSortBy] = useState("Relevancia");

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Search Results Title */}
        <div className="py-4">
          <h1 className="text-lg font-normal">
            Resultados para <span className="font-semibold">&quot;mobile&quot;</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`pb-3 px-1 relative transition-colors ${
                activeTab === index
                  ? "text-black font-medium"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              {tab.name} ({tab.count})
              {activeTab === index && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
              )}
            </button>
          ))}
        </div>

        {/* Results Count and Sort */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="font-semibold">Filtros</span>
            <span className="text-gray-600">999+ Resultados</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">ORDENAR POR</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm font-medium border-none outline-none cursor-pointer bg-transparent"
            >
              <option>Relevancia</option>
              <option>Más reciente</option>
              <option>Más antiguo</option>
            </select>
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
