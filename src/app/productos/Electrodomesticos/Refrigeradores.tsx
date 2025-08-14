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
import refrigeradorImg from "../../../img/Electrodomesticos/Electrodomesticos1.png";
import lavadoraImg from "../../../img/Electrodomesticos/Electrodomesticos2.png";
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

const refrigeradorProducts = [
  {
    id: "rf28r7351sr",
    name: "Samsung Refrigerador French Door 27.4 pies RF28R7351SR",
    image: refrigeradorImg,
    colors: [
      { name: "steel", hex: "#71717A", label: "Acero Inoxidable" },
    ] as ProductColor[],
    rating: 4.8,
    reviewCount: 452,
    price: "$ 4.499.000",
    originalPrice: "$ 4.999.000",
    discount: "-10%",
    isNew: true,
  },
  {
    id: "rs27t5200s9",
    name: "Samsung Refrigerador Side by Side 27 pies RS27T5200S9",
    image: refrigeradorImg,
    colors: [
      { name: "steel", hex: "#71717A", label: "Acero Inoxidable" },
      { name: "black", hex: "#000000", label: "Negro" },
    ] as ProductColor[],
    rating: 4.6,
    reviewCount: 326,
    price: "$ 2.899.000",
    originalPrice: "$ 3.299.000",
    discount: "-12%",
  },
];

export default function RefrigeradoresSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tipo"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  // Eliminados viewMode y sortBy por no usarse
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

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
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
            <div
              className={cn(
                "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {refrigeradorProducts.map((product) => (
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
                      category: "refrigeradores",
                    });
                  }}
                  onToggleFavorite={(productId: string) => {
                    posthogUtils.capture("toggle_favorite", {
                      product_id: productId,
                      product_name: product.name,
                      category: "refrigeradores",
                    });
                  }}
                  // className eliminado, solo usar el default
                />
              ))}
            </div>
          </main>
        </div>
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
