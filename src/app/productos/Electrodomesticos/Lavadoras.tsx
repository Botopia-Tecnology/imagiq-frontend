"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ProductCard, { type ProductColor } from "../components/ProductCard";
import FilterSidebar, {
  MobileFilterModal,
  type FilterConfig,
  type FilterState,
} from "../components/FilterSidebar";
import CategorySlider, { type Category } from "../components/CategorySlider";
import { posthogUtils } from "@/lib/posthogClient";
import lavadoraImg from "../../../img/Electrodomesticos/Electrodomesticos2.png";
import refrigeradorImg from "../../../img/Electrodomesticos/Electrodomesticos1.png";
import microondasImg from "../../../img/Electrodomesticos/Electrodomesticos4.png";
import aspiradoraImg from "../../../img/Electrodomesticos/Electrodomesticos3.png";

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

const lavadorasFilters: FilterConfig = {
  tipo: [
    "Carga Frontal",
    "Carga Superior",
    "Lavasecadora",
    "Mini",
    "Industrial",
  ],
  capacidad: ["<8kg", "8-12kg", "12-18kg", ">18kg"],
  color: ["Blanco", "Negro", "Gris", "Inox"],
  eficienciaEnergetica: ["A++", "A+", "A", "B"],
  caracteristicas: [
    "Digital Inverter",
    "EcoBubble",
    "Auto Dosificación",
    "WiFi",
    "Vapor",
    "Panel Touch",
  ],
  rangoPrecio: [
    { label: "Menos de $1.000.000", min: 0, max: 1000000 },
    { label: "$1.000.000 - $2.000.000", min: 1000000, max: 2000000 },
    { label: "$2.000.000 - $3.000.000", min: 2000000, max: 3000000 },
    { label: "Más de $3.000.000", min: 3000000, max: Infinity },
  ],
};

export const lavadorasProducts = [
  {
    id: "ww22k6800ew",
    name: "Samsung Lavadora Carga Frontal 22kg WW22K6800EW",
    image: lavadoraImg,
    colors: [
      { name: "white", hex: "#F3F4F6", label: "Blanco" },
      { name: "gray", hex: "#71717A", label: "Gris" },
    ] as ProductColor[],
    rating: 4.7,
    reviewCount: 210,
    price: "$ 2.199.000",
    originalPrice: "$ 2.499.000",
    discount: "-12%",
    isNew: true,
  },
  {
    id: "wa16t6260bw",
    name: "Samsung Lavadora Carga Superior 16kg WA16T6260BW",
    image: lavadoraImg,
    colors: [
      { name: "white", hex: "#F3F4F6", label: "Blanco" },
      { name: "inox", hex: "#A3A3A3", label: "Inox" },
    ] as ProductColor[],
    rating: 4.5,
    reviewCount: 134,
    price: "$ 1.499.000",
    originalPrice: "$ 1.799.000",
    discount: "-17%",
  },
];

export default function LavadorasSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tipo"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [resultCount] = useState(8);

  useEffect(() => {
    posthogUtils.capture("section_view", {
      section: "lavadoras",
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
        trackingPrefix="lavadora_category"
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filterConfig={lavadorasFilters}
              filters={filters}
              onFilterChange={handleFilterChange}
              resultCount={resultCount}
              expandedFilters={expandedFilters}
              onToggleFilter={toggleFilter}
              trackingPrefix="lavadora_filter"
            />
          </aside>

          <main className="flex-1">
            <div
              className={cn(
                "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {lavadorasProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  image={product.image}
                  colors={product.colors}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  discount={product.discount}
                  isNew={product.isNew}
                  onAddToCart={(productId: string, color: string) => {
                    posthogUtils.capture("add_to_cart", {
                      product_id: productId,
                      product_name: product.name,
                      product_color: color,
                      product_price: product.price,
                      category: "lavadoras",
                    });
                  }}
                  onToggleFavorite={(productId: string) => {
                    posthogUtils.capture("toggle_favorite", {
                      product_id: productId,
                      product_name: product.name,
                      category: "lavadoras",
                    });
                  }}
                />
              ))}
            </div>
          </main>
        </div>
      </div>

      <MobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filterConfig={lavadorasFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        resultCount={resultCount}
        expandedFilters={expandedFilters}
        onToggleFilter={toggleFilter}
        trackingPrefix="lavadora_filter"
      />
    </div>
  );
}
