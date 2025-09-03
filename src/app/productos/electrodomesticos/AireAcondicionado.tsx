"use client";

import { useState, useEffect } from "react";
// import { cn } from "@/lib/utils";
import ProductCard from "../components/ProductCard";
import FilterSidebar, {
  type FilterConfig,
  type FilterState,
} from "../components/FilterSidebar";
import CategorySlider, { type Category } from "../components/CategorySlider";
import { posthogUtils } from "@/lib/posthogClient";
import aireImg from "../../../img/electrodomesticos/electrodomesticos4.png";
import refrigeradorImg from "../../../img/electrodomesticos/electrodomesticos1.png";
import lavadoraImg from "../../../img/electrodomesticos/electrodomesticos2.png";
import microondasImg from "../../../img/electrodomesticos/electrodomesticos4.png";
import aspiradoraImg from "../../../img/electrodomesticos/electrodomesticos3.png";
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
  {
    id: "aire-acondicionado",
    name: "Aire Acondicionado",
    subtitle: "",
    image: aireImg,
    href: "/productos/Electrodomesticos?section=aire-acondicionado",
  },
];

const aireFilters: FilterConfig = {
  tipo: ["Split", "Inverter", "Portátil", "Cassette", "Ventana"],
  capacidad: ["9000 BTU", "12000 BTU", "18000 BTU", "24000 BTU"],
  color: ["Blanco", "Gris", "Negro"],
  eficienciaEnergetica: ["A+++", "A++", "A+", "A"],
  caracteristicas: [
    "WiFi",
    "Filtro antibacteriano",
    "Deshumidificador",
    "Auto limpieza",
    "Silencioso",
    "Control remoto",
  ],
  rangoPrecio: [
    { label: "Menos de $1.500.000", min: 0, max: 1500000 },
    { label: "$1.500.000 - $2.500.000", min: 1500000, max: 2500000 },
    { label: "Más de $2.500.000", min: 2500000, max: Infinity },
  ],
};

export default function AireAcondicionadoSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tipo"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(5);

  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "aire-acondicionado",
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
        trackingPrefix="aire_category"
      />
      <div className="container mx-auto px-6 py-8 flex gap-8">
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <FilterSidebar
            filterConfig={aireFilters}
            filters={filters}
            onFilterChange={handleFilterChange}
            resultCount={resultCount}
            expandedFilters={expandedFilters}
            onToggleFilter={toggleFilter}
            trackingPrefix="aire_filter"
          />
        </aside>
        <main className="flex-1">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {productsData.electrodomesticos
              .filter((product) =>
                product.name.toLowerCase().includes("aire acondicionado")
              )
              .map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}
