"use client";

import React from "react";

export default function ProductShowcase() {
  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Las soluciones que tu empresa necesita
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra selección de productos empresariales con descuentos
            especiales por volumen
          </p>
        </div>
      </div>
    </section>
  );
}
