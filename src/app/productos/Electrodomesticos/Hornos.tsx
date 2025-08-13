/**
 * 🧭 SECCIÓN DE HORNO - IMAGIQ ECOMMERCE
 */

"use client";

import { useState, useEffect } from "react";
import { Filter, Grid3X3, List } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard, { type ProductColor } from "../components/ProductCard";
import FilterSidebar, {
  MobileFilterModal,
  type FilterConfig,
  type FilterState,
} from "../components/FilterSidebar";
import CategorySlider, { type Category } from "../components/CategorySlider";
import { posthogUtils } from "@/lib/posthogClient";

import hornosImg from "../../../img/Electrodomesticos/Electrodomesticos4.png";
import refrigeradorImg from "../../../img/Electrodomesticos/Electrodomesticos1.png";
import lavadoraImg from "../../../img/Electrodomesticos/Electrodomesticos2.png";
import microondasImg from "../../../img/Electrodomesticos/Electrodomesticos4.png";
import aspiradoraImg from "../../../img/Electrodomesticos/Electrodomesticos3.png";

const applianceCategories = [
  {
    id: "hornos",
    name: "Hornos",
    imageSrc: hornosImg,
    imageAlt: "Hornos",
  },
  {
    id: "refrigeradores",
    name: "Refrigeradores",
    imageSrc: refrigeradorImg,
    imageAlt: "Refrigeradores",
  },
  {
    id: "lavadoras",
    name: "Lavadoras",
    imageSrc: lavadoraImg,
    imageAlt: "Lavadoras",
  },
  {
    id: "microondas",
    name: "Microondas",
    imageSrc: microondasImg,
    imageAlt: "Microondas",
  },
  {
    id: "aspiradoras",
    name: "Aspiradoras",
    imageSrc: aspiradoraImg,
    imageAlt: "Aspiradoras",
  },
];

const hornosFilters = [
  {
    id: "tipo",
    name: "Tipo",
    options: [
      { value: "convencional", label: "Convencional" },
      { value: "digital", label: "Digital" },
      { value: "microondas", label: "Microondas" },
    ],
  },
  {
    id: "marca",
    name: "Marca",
    options: [
      { value: "samsung", label: "Samsung" },
      { value: "lg", label: "LG" },
      { value: "whirlpool", label: "Whirlpool" },
    ],
  },
  {
    id: "precio",
    name: "Rango de precio",
    options: [
      { value: "0-100", label: "Menos de $100" },
      { value: "100-300", label: "Entre $100 y $300" },
      { value: "300-500", label: "Entre $300 y $500" },
      { value: "500+", label: "Más de $500" },
    ],
  },
];

const hornosProducts = [
  {
    id: 1,
    name: "Horno Samsung Digital",
    price: 299.99,
    imageSrc: "/img/productos/hornodigital.jpg",
    imageAlt: "Horno Samsung Digital",
    colors: [
      { name: "Negro", class: "bg-black", selectedClass: "ring-gray-900" },
      {
        name: "Acero inoxidable",
        class: "bg-gray-300",
        selectedClass: "ring-gray-900",
      },
    ] as ProductColor[],
  },
  {
    id: 2,
    name: "Horno Whirlpool Convencional",
    price: 199.99,
    imageSrc: "/img/productos/hornoconvencional.jpg",
    imageAlt: "Horno Whirlpool Convencional",
    colors: [
      { name: "Blanco", class: "bg-white", selectedClass: "ring-gray-900" },
      { name: "Negro", class: "bg-black", selectedClass: "ring-gray-900" },
    ] as ProductColor[],
  },
  {
    id: 3,
    name: "Horno LG Microondas",
    price: 149.99,
    imageSrc: "/img/productos/hornomicroondas.jpg",
    imageAlt: "Horno LG Microondas",
    colors: [
      {
        name: "Plateado",
        class: "bg-gray-400",
        selectedClass: "ring-gray-900",
      },
      { name: "Negro", class: "bg-black", selectedClass: "ring-gray-900" },
    ] as ProductColor[],
  },
];

export default function HornosSection() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(
    hornosFilters.reduce((acc, filter) => {
      acc[filter.id] = filter.options.reduce((o, option) => {
        o[option.value] = false;
        return o;
      }, {} as Record<string, boolean>);
      return acc;
    }, {} as FilterState)
  );
  const [filteredProducts, setFilteredProducts] = useState(hornosProducts);

  useEffect(() => {
    // Aplicar filtros a los productos (simulación)
    let newFilteredProducts = hornosProducts;

    // Filtrado por ejemplo
    if (filters.tipo.convencional) {
      newFilteredProducts = newFilteredProducts.filter((product) =>
        product.name.includes("Convencional")
      );
    }

    setFilteredProducts(newFilteredProducts);
  }, [filters]);

  const handleFilterChange = (filterId: string, optionValue: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterId]: {
        ...prevFilters[filterId],
        [optionValue]: !prevFilters[filterId][optionValue],
      },
    }));
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Hornos</h2>

        <div className="flex flex-col lg:flex-row lg:space-x-6">
          {/* Filtros */}
          <div className="hidden lg:block lg:w-1/4">
            <FilterSidebar
              filters={hornosFilters}
              onFilterChange={handleFilterChange}
              className="sticky top-20"
            />
          </div>

          {/* Contenido principal */}
          <div className="w-full lg:w-3/4">
            {/* Slider de categorías - solo en desktop */}
            <div className="hidden lg:block mb-8">
              <CategorySlider
                categories={applianceCategories}
                title="Categorías relacionadas"
              />
            </div>

            {/* Productos filtrados */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

        {/* Botón de filtro móvil */}
        <div className="lg:hidden mt-4">
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filtrar productos
          </button>
        </div>

        {/* Modal de filtro móvil */}
        <MobileFilterModal
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filters={hornosFilters}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
}
