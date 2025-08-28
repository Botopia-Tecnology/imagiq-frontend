"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ProductCard from "../components/ProductCard";
import FilterSidebar, {
  type FilterConfig,
  type FilterState,
  MobileFilterModal,
} from "../components/FilterSidebar";
import CategorySlider, { type Category } from "../components/CategorySlider";
import { posthogUtils } from "@/lib/posthogClient";
import refrigeradorImg from "../../../img/electrodomesticos/Electrodomesticos1.png";
import lavadoraImg from "../../../img/electrodomesticos/Electrodomesticos2.png";
import microondasImg from "../../../img/electrodomesticos/Electrodomesticos4.png";
import aspiradoraImg from "../../../img/electrodomesticos/Electrodomesticos3.png";
import { productsData } from "../data_product/products";

const applianceCategories: Category[] = [
  {
    id: "refrigeradores",
    name: "Refrigeradores",
    subtitle: "",
    image: refrigeradorImg,
    href: "/productos/Electrodomesticos?section=refrigeradores",
  },
  {
    id: "lavadoras",
    name: "Lavadoras",
    subtitle: "",
    image: lavadoraImg,
    href: "/productos/Electrodomesticos?section=lavadoras",
  },
  {
    id: "microondas",
    name: "Microondas",
    subtitle: "",
    image: microondasImg,
    href: "/productos/Electrodomesticos?section=microondas",
  },
  {
    id: "aspiradoras",
    name: "Aspiradoras",
    subtitle: "",
    image: aspiradoraImg,
    href: "/productos/Electrodomesticos?section=aspiradoras",
  },
];

const refrigeradoresFilters: FilterConfig = {
  tipo: [
    "French Door",
    "Side by Side",
    "Top Freezer",
    "Bottom Freezer",
    "Multi-Door",
  ],
  capacidad: ["<400L", "400-500L", "500-600L", ">600L"],
  color: ["Inox", "Negro", "Blanco", "Gris", "Beige"],
  eficienciaEnergetica: ["A+++", "A++", "A+", "A"],
  caracteristicas: [
    "Family Hub",
    "Dispensador de agua/hielo",
    "No Frost",
    "Twin Cooling",
    "WiFi",
    "Compresor Digital Inverter",
  ],
  rangoPrecio: [
    { label: "Menos de $1.000.000", min: 0, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "$2.000.000 - $4.000.000", min: 2000000, max: 4000000 },
    { label: "Más de $4.000.000", min: 4000000, max: Infinity },
  ],
};

export default function RefrigeradoresSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tipo"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(16);

  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "refrigeradores",
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
        trackingPrefix="refrigerador_category"
      />
      <div className="container mx-auto px-6 py-8 flex gap-8">
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar
            filterConfig={refrigeradoresFilters}
            filters={filters}
            onFilterChange={handleFilterChange}
            resultCount={resultCount}
            expandedFilters={expandedFilters}
            onToggleFilter={toggleFilter}
            trackingPrefix="refrigerador_filter"
          />
        </aside>
        <main className="flex-1">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {productsData.electrodomesticos
              .filter((product) =>
                product.name.toLowerCase().includes("refrigerador")
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
        filterConfig={refrigeradoresFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        resultCount={resultCount}
        expandedFilters={expandedFilters}
        onToggleFilter={toggleFilter}
        trackingPrefix="refrigerador_filter"
      />
    </div>
  );
}
