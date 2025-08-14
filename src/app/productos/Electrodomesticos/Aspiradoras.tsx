/**
 * 🧭 SECCIÓN DE ASPIRADORAS - IMAGIQ ECOMMERCE
 */

"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ProductCard from "../components/ProductCard";
import FilterSidebar, {
  MobileFilterModal,
  type FilterConfig,
  type FilterState,
} from "../components/FilterSidebar";
import CategorySlider, { type Category } from "../components/CategorySlider";
import { posthogUtils } from "@/lib/posthogClient";

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

const aspiradoraProducts = [
  {
    id: "1",
    name: "Aspiradora Samsung Jet 90",
    image: aspiradoraImg,
    colors: [
      { name: "white", hex: "#ffffff", label: "Blanco" },
      { name: "black", hex: "#000000", label: "Negro" },
    ],
    rating: 4.5,
    reviewCount: 120,
    price: "$299.99",
    originalPrice: "$399.99",
    discount: "-25%",
    isNew: true,
  },
  {
    id: "2",
    name: "Aspiradora LG CordZero",
    image: aspiradoraImg,
    colors: [{ name: "white", hex: "#ffffff", label: "Blanco" }],
    rating: 4.7,
    reviewCount: 95,
    price: "$349.99",
    originalPrice: "$449.99",
    discount: "-22%",
    isNew: false,
  },
  {
    id: "3",
    name: "Aspiradora de cilindro Whirlpool",
    image: aspiradoraImg,
    colors: [
      { name: "red", hex: "#ff0000", label: "Rojo" },
      { name: "blue", hex: "#0000ff", label: "Azul" },
    ],
    rating: 4.2,
    reviewCount: 80,
    price: "$199.99",
    originalPrice: "$249.99",
    discount: "-20%",
    isNew: false,
  },
  {
    id: "4",
    name: "Robot Aspirador Philips",
    image: aspiradoraImg,
    colors: [{ name: "black", hex: "#000000", label: "Negro" }],
    rating: 4.8,
    reviewCount: 60,
    price: "$499.99",
    originalPrice: "$599.99",
    discount: "-16%",
    isNew: true,
  },
];

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
        trackingPrefix="aspiradora_category"
      />

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
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
            <div
              className={cn(
                "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
              )}
            >
              {aspiradoraProducts.map((product) => (
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
                      category: "aspiradoras",
                    });
                  }}
                  onToggleFavorite={(productId: string) => {
                    posthogUtils.capture("toggle_favorite", {
                      product_id: productId,
                      product_name: product.name,
                      category: "aspiradoras",
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
