"use client";

import { useState, useEffect } from "react";
// import { cn } from "@/lib/utils";
import ProductCard from "../components/ProductCard";
import FilterSidebar, {
  type FilterConfig,
  type FilterState,
  MobileFilterModal,
} from "../components/FilterSidebar";
import CategorySlider, { type Category } from "../components/CategorySlider";
import { posthogUtils } from "@/lib/posthogClient";
import { productsData } from "../data_product/products";
import lavavajillasImg from "@/img/electrodomesticos/electrodomesticos4.png";
import refrigeradorImg from "@/img/electrodomesticos/electrodomesticos1.png";
import lavadoraImg from "@/img/electrodomesticos/electrodomesticos2.png";
import microondasImg from "@/img/electrodomesticos/electrodomesticos4.png";
import aspiradoraImg from "@/img/electrodomesticos/electrodomesticos3.png";

const applianceCategories: Category[] = [
  {
    id: "refrigeradores",
    name: "Refrigeradores",
    subtitle: "",
    image: refrigeradorImg,
    href: "/productos/electrodomesticos?section=refrigeradores",
  },
  {
    id: "lavadoras",
    name: "Lavadoras",
    subtitle: "",
    image: lavadoraImg,
    href: "/productos/electrodomesticos?section=lavadoras",
  },
  {
    id: "lavavajillas",
    name: "Lavavajillas",
    subtitle: "",
    image: lavavajillasImg,
    href: "/productos/electrodomesticos?section=lavavajillas",
  },
  {
    id: "microondas",
    name: "Microondas",
    subtitle: "",
    image: microondasImg,
    href: "/productos/electrodomesticos?section=microondas",
  },
  {
    id: "aspiradoras",
    name: "Aspiradoras",
    subtitle: "",
    image: aspiradoraImg,
    href: "/productos/electrodomesticos?section=aspiradoras",
  },
];

const lavavajillasFilters: FilterConfig = {
  tipo: ["Integrable", "Libre Instalación", "Compacto", "Industrial"],
  capacidad: [
    "6-8 cubiertos",
    "9-12 cubiertos",
    "13-15 cubiertos",
    ">15 cubiertos",
  ],
  color: ["Blanco", "Inox", "Negro", "Gris"],
  eficienciaEnergetica: ["A++", "A+", "A", "B"],
  caracteristicas: [
    "Motor Digital Inverter",
    "Eco Program",
    "Secado Extra",
    "WiFi",
    "Panel Touch",
    "Inicio Diferido",
  ],
  rangoPrecio: [
    { label: "Menos de $1.000.000", min: 0, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "$2.000.000 - $3.000.000", min: 2000000, max: 3000000 },
    { label: "Más de $3.000.000", min: 3000000, max: Infinity },
  ],
};

export default function LavavajillasSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tipo"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(8);

  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "lavavajillas",
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
        trackingPrefix="lavavajillas_category"
      />
      <div className="container mx-auto px-6 py-8 flex gap-8">
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar
            filterConfig={lavavajillasFilters}
            filters={filters}
            onFilterChange={handleFilterChange}
            resultCount={resultCount}
            expandedFilters={expandedFilters}
            onToggleFilter={toggleFilter}
            trackingPrefix="lavavajillas_filter"
          />
        </aside>
        <main className="flex-1">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {productsData.electrodomesticos
              .filter((product) =>
                product.name.toLowerCase().includes("lavavajilla")
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
        filterConfig={lavavajillasFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        resultCount={resultCount}
        expandedFilters={expandedFilters}
        onToggleFilter={toggleFilter}
        trackingPrefix="lavavajillas_filter"
      />
    </div>
  );
}
