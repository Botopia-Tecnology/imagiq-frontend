/**
 * 🧭 SECCIÓN DE ASPIRADORAS - IMAGIQ ECOMMERCE
 */

"use client";

import { useState, useEffect } from "react";
// import { cn } from "@/lib/utils";
import ProductCard from "../components/ProductCard";
import FilterSidebar, {
  MobileFilterModal,
  type FilterConfig,
  type FilterState,
} from "../components/FilterSidebar";
import CategorySlider, { type Category } from "../components/CategorySlider";
import { posthogUtils } from "@/lib/posthogClient";
import { productsData } from "../data_product/products";

import aspiradoraImg from "../../../img/Electrodomesticos/Electrodomesticos3.png";
import refrigeradorImg from "../../../img/Electrodomesticos/Electrodomesticos1.png";
import lavadoraImg from "../../../img/Electrodomesticos/Electrodomesticos2.png";
import microondasImg from "../../../img/Electrodomesticos/Electrodomesticos4.png";

const applianceCategories: Category[] = [
  {
    id: "1",
    name: "Aspiradoras",
    image: aspiradoraImg,
    subtitle: "Aspiradoras de alta potencia",
    href: "/productos/aspiradoras",
  },
  {
    id: "2",
    name: "Refrigeradores",
    image: refrigeradorImg,
    subtitle: "Refrigeradores de última generación",
    href: "/productos/refrigeradores",
  },
  {
    id: "3",
    name: "Lavadoras",
    image: lavadoraImg,
    subtitle: "Lavadoras eficientes",
    href: "/productos/lavadoras",
  },
  {
    id: "4",
    name: "Microondas",
    image: microondasImg,
    subtitle: "Microondas modernos",
    href: "/productos/microondas",
  },
];

const aspiradorasFilters: FilterConfig = {
  tipo: ["Vertical", "Robot", "De cilindro"],
  precio: [
    "Menos de $100",
    "Entre $100 y $300",
    "Entre $300 y $500",
    "Más de $500",
  ],
  marca: ["Samsung", "LG", "Whirlpool", "Philips"],
};

export default function AspiradorasSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tipo"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(8);

  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "aspiradoras",
      category: "electrodomesticos",
    });
  }, []);

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
    <div className="min-h-screen bg-white">
      <CategorySlider
        categories={applianceCategories}
        trackingPrefix="aspiradoras_category"
      />
      <div className="container mx-auto px-6 py-8 flex gap-8">
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar
            filterConfig={aspiradorasFilters}
            filters={filters}
            onFilterChange={handleFilterChange}
            resultCount={resultCount}
            expandedFilters={expandedFilters}
            onToggleFilter={toggleFilter}
            trackingPrefix="aspiradora_filter"
          />
        </aside>
        <main className="flex-1">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {productsData.electrodomesticos
              .filter((product) =>
                product.name.toLowerCase().includes("aspiradora")
              )
              .map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
          </div>
        </main>
      </div>
      <MobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filterConfig={aspiradorasFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        resultCount={resultCount}
        expandedFilters={expandedFilters}
        onToggleFilter={toggleFilter}
        trackingPrefix="aspiradora_filter"
      />
    </div>
  );
}
