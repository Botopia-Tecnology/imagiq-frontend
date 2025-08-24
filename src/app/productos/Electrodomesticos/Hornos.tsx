/**
 * 🧭 SECCIÓN DE HORNO - IMAGIQ ECOMMERCE
 */

"use client";

import { useState } from "react";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import CategorySlider from "../components/CategorySlider";
import { productsData } from "../data_product/products";

import hornosImg from "../../../img/Electrodomesticos/Electrodomesticos4.png";
import refrigeradorImg from "../../../img/Electrodomesticos/Electrodomesticos1.png";
import lavadoraImg from "../../../img/Electrodomesticos/Electrodomesticos2.png";
import microondasImg from "../../../img/Electrodomesticos/Electrodomesticos4.png";
import aspiradoraImg from "../../../img/Electrodomesticos/Electrodomesticos3.png";

const applianceCategories = [
  {
    id: "hornos",
    name: "Hornos",
    image: hornosImg,
    subtitle: "Hornos de última generación",
    href: "/productos/hornos",
  },
  {
    id: "refrigeradores",
    name: "Refrigeradores",
    image: refrigeradorImg,
    subtitle: "Refrigeradores de última generación",
    href: "/productos/refrigeradores",
  },
  {
    id: "lavadoras",
    name: "Lavadoras",
    image: lavadoraImg,
    subtitle: "Lavadoras eficientes",
    href: "/productos/lavadoras",
  },
  {
    id: "microondas",
    name: "Microondas",
    image: microondasImg,
    subtitle: "Microondas modernos",
    href: "/productos/microondas",
  },
  {
    id: "aspiradoras",
    name: "Aspiradoras",
    image: aspiradoraImg,
    subtitle: "Aspiradoras de alta potencia",
    href: "/productos/aspiradoras",
  },
];

const hornosFilters = {
  tipo: ["Convencional", "Digital", "Microondas"],
  marca: ["Samsung", "LG", "Whirlpool"],
  precio: [
    "Menos de $100",
    "Entre $100 y $300",
    "Entre $300 y $500",
    "Más de $500",
  ],
};

export default function HornosSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tipo"])
  );
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [resultCount] = useState(3);

  const handleFilterChange = (
    filterType: string,
    value: string,
    checked: boolean
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: checked
        ? [...(prev[filterType] || []), value]
        : (prev[filterType] || []).filter((item) => item !== value),
    }));
  };

  const toggleFilter = (filterKey: string) => {
    const newExpanded = new Set(expandedFilters);
    if (newExpanded.has(filterKey)) {
      newExpanded.delete(filterKey);
    } else {
      newExpanded.add(filterKey);
    }
    setExpandedFilters(newExpanded);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Hornos</h2>

        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Filtros */}
          <div className="hidden lg:block lg:w-1/4">
            <FilterSidebar
              filterConfig={hornosFilters}
              filters={filters}
              onFilterChange={handleFilterChange}
              resultCount={resultCount}
              expandedFilters={expandedFilters}
              onToggleFilter={toggleFilter}
              trackingPrefix="hornos_filter"
              className="sticky top-20"
            />
          </div>

          {/* Contenido principal */}
          <div className="w-full lg:w-3/4">
            {/* Slider de categorías - solo en desktop */}
            <div className="hidden lg:block mb-8">
              <CategorySlider
                categories={applianceCategories}
                trackingPrefix="hornos_category"
              />
            </div>

            {/* Productos filtrados */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {productsData.electrodomesticos
                .filter((product) =>
                  product.name.toLowerCase().includes("horno")
                )
                .map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
            </div>
          </div>
        </div>

        {/* Botón de filtro móvil */}
        <div className="lg:hidden mt-4">
          <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200">
            {/* Puedes usar un icono de filtro aquí si lo tienes importado */}
            Filtrar productos
          </button>
        </div>

        {/* Modal de filtro móvil */}
        {/* Fin de la sección */}
      </div>
    </div>
  );
}
