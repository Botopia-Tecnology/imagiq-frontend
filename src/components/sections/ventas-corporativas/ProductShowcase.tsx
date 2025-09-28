"use client";

import React, { useState } from "react";
import { PRODUCT_CATEGORIES } from "@/constants/corporate-sales";
import { CorporateProduct } from "@/types/corporate-sales";

interface ProductShowcaseProps {
  selectedIndustry?: string;
}

export default function ProductShowcase({
  selectedIndustry,
}: ProductShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>("ofertas");

  const activeProducts =
    PRODUCT_CATEGORIES.find((cat) => cat.id === activeCategory)?.products || [];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Las soluciones que tu empresa necesita
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de productos empresariales con descuentos
            especiales por volumen
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {PRODUCT_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out
                ${
                  activeCategory === category.id
                    ? "bg-black text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:shadow-sm"
                }
              `}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {activeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {activeProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-2xl flex items-center justify-center">
              <span className="text-4xl text-gray-400">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Próximamente
            </h3>
            <p className="text-gray-500">
              Estamos preparando productos especiales para esta categoría
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// Product Card Component
function ProductCard({ product }: { product: CorporateProduct }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 rounded-t-2xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center">
            <span className="text-gray-500 text-4xl">📱</span>
          </div>
        </div>
        {/* Discount Badge */}
        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Oferta Corporativa
        </div>
      </div>

      {/* Product Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        <p className="text-gray-600 mb-4 text-sm">{product.description}</p>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-800 mb-2">
              Características:
            </h4>
            <ul className="space-y-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            {product.price || "Precio especial"}
          </span>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Cotizar
          </button>
        </div>
      </div>
    </div>
  );
}
