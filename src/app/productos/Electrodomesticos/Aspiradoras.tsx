/**
 * 🧭 SECCIÓN DE ASPIRADORAS - IMAGIQ ECOMMERCE
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

import aspiradoraImg from "../../../img/Electrodomesticos/Electrodomesticos3.png";
import refrigeradorImg from "../../../img/Electrodomesticos/Electrodomesticos1.png";
import lavadoraImg from "../../../img/Electrodomesticos/Electrodomesticos2.png";
import microondasImg from "../../../img/Electrodomesticos/Electrodomesticos4.png";

const applianceCategories: Category[] = [
  {
    id: "1",
    name: "Aspiradoras",
    image: aspiradoraImg,
    trackingPrefix: "aspiradora_category",
  },
  {
    id: "2",
    name: "Refrigeradores",
    image: refrigeradorImg,
    trackingPrefix: "refrigerador_category",
  },
  {
    id: "3",
    name: "Lavadoras",
    image: lavadoraImg,
    trackingPrefix: "lavadora_category",
  },
  {
    id: "4",
    name: "Microondas",
    image: microondasImg,
    trackingPrefix: "microondas_category",
  },
];

const aspiradorasFilters: FilterConfig = {
  tipo: {
    label: "Tipo",
    options: [
      { value: "vertical", label: "Vertical" },
      { value: "robot", label: "Robot" },
      { value: "de_cylinder", label: "De cilindro" },
    ],
  },
  precio: {
    label: "Rango de precio",
    options: [
      { value: "0-100", label: "Menos de $100" },
      { value: "100-300", label: "Entre $100 y $300" },
      { value: "300-500", label: "Entre $300 y $500" },
      { value: "500+", label: "Más de $500" },
    ],
  },
  marca: {
    label: "Marca",
    options: [
      { value: "samsung", label: "Samsung" },
      { value: "lg", label: "LG" },
      { value: "whirlpool", label: "Whirlpool" },
      { value: "philips", label: "Philips" },
    ],
  },
};

const aspiradoraProducts = [
  {
    id: "1",
    name: "Aspiradora Samsung Jet 90",
    image: aspiradoraImg,
    colors: ["#ffffff", "#000000"],
    rating: 4.5,
    reviewCount: 120,
    price: 299.99,
    originalPrice: 399.99,
    discount: 25,
    isNew: true,
  },
  {
    id: "2",
    name: "Aspiradora LG CordZero",
    image: aspiradoraImg,
    colors: ["#ffffff"],
    rating: 4.7,
    reviewCount: 95,
    price: 349.99,
    originalPrice: 449.99,
    discount: 22,
    isNew: false,
  },
  {
    id: "3",
    name: "Aspiradora de cilindro Whirlpool",
    image: aspiradoraImg,
    colors: ["#ff0000", "#0000ff"],
    rating: 4.2,
    reviewCount: 80,
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    isNew: false,
  },
  {
    id: "4",
    name: "Robot Aspirador Philips",
    image: aspiradoraImg,
    colors: ["#000000"],
    rating: 4.8,
    reviewCount: 60,
    price: 499.99,
    originalPrice: 599.99,
    discount: 16,
    isNew: true,
  },
];

export default function AspiradorasSection() {
  const [expandedFilters, setExpandedFilters] = useState<Set<string>>(
    new Set(["tipo"])
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevancia");
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
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
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
                  onMoreInfo={(productId: string) => {
                    posthogUtils.capture("product_info", {
                      product_id: productId,
                      product_name: product.name,
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
                  className={viewMode === "list" ? "flex-row" : ""}
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
