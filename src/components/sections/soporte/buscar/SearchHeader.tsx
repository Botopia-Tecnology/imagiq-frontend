"use client";

import { useState } from "react";

const tabs = [
  { name: "Productos", count: 63 },
  { name: "Accesorios", count: 395 },
  { name: "Asistencia técnica", count: 1268 },
  { name: "Otro", count: 189 },
];

export function SearchHeader() {
  const [activeTab, setActiveTab] = useState(2); // Asistencia técnica activo
  const [sortBy, setSortBy] = useState("Relevancia");

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Fila 1: Resultados para 'mobile' y Tabs */}
        <div className="flex items-center py-4">
          <h1 className="text-lg font-bold text-black">
            Resultados para <span className="font-bold">&quot;mobile&quot;</span>
          </h1>
          
          <div className="flex items-center gap-8 ml-8">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className="px-1 transition-colors font-bold text-black relative"
              >
                {tab.name} ({tab.count})
                {activeTab === index && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Fila 2: Filtros, Resultados y ORDENAR POR */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-black">Filtros</h2>
            <span className="text-black font-bold text-sm">999+ Resultados</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold">ORDENAR POR</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm font-bold border-none outline-none cursor-pointer bg-transparent"
            >
              <option>Relevancia</option>
              <option>Más reciente</option>
              <option>Más antiguo</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
