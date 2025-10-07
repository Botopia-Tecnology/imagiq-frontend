"use client";

import { useState } from "react";

const categories = [
  "Accesorios",
  "Aire acondicionado",
  "Aplicaciones y servicios",
  "Audio",
  "Audio inalámbrico",
];

const contentTypes = [
  "Manual de usuario",
  "Manual fácil",
  "Software",
];

const contentSources = [
  "Apoyar a otros",
  "Noticias",
  "Preguntas frecuentes de la tienda",
  "Productos",
  "Soluciones",
];

export function FiltersSidebar() {
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([]);
  const [selectedContentSources, setSelectedContentSources] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleContentType = (type: string) => {
    setSelectedContentTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleContentSource = (source: string) => {
    setSelectedContentSources((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source]
    );
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 space-y-6">
      {/* PRODUCT CATEGORY */}
      <div>
        <button className="w-full flex items-center justify-between mb-4">
          <span className="font-semibold text-sm">PRODUCT CATEGORY</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>

        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}

          <button
            onClick={() => setShowMoreCategories(!showMoreCategories)}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            Ver más
            <svg
              className={`w-4 h-4 transition-transform ${
                showMoreCategories ? "rotate-180" : ""
              }`}
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
          </button>
        </div>
      </div>

      {/* CONTENT TYPE */}
      <div>
        <button className="w-full flex items-center justify-between mb-4">
          <span className="font-semibold text-sm">CONTENT TYPE</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>

        <div className="space-y-3">
          {contentTypes.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedContentTypes.includes(type)}
                onChange={() => toggleContentType(type)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* CONTENT SOURCE */}
      <div>
        <button className="w-full flex items-center justify-between mb-4">
          <span className="font-semibold text-sm">CONTENT SOURCE</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>

        <div className="space-y-3">
          {contentSources.map((source) => (
            <label
              key={source}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedContentSources.includes(source)}
                onChange={() => toggleContentSource(source)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm">{source}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
