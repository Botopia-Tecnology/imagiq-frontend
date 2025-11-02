"use client";

import { useState } from "react";

const categories = [
  {
    id: "movil",
    name: "DISPOSITIVO MÓVIL",
    products: [
      {
        title: "Smartphones",
        warrantyPeriod: "12 Meses",
        description: "Período de Garantía"
      },
      {
        title: "Tabletas",
        warrantyPeriod: "12 Meses", 
        description: "Período de Garantía"
      },
      {
        title: "Accesorios",
        warrantyPeriod: "12 Meses",
        description: "Período de Garantía",
        note: "*Solo aplica para productos comprados individualmente en samsung.com/co",
        items: [
          "SmartTag - Periodo de garantía 12 meses.",
          "Adaptadores de carga y cables para dispositivos móviles",
          "Fundas y protectores oficiales",
          "Auriculares y accesorios de audio"
        ]
      }
    ]
  },
  {
    id: "tv",
    name: "TV Y AV",
    products: [
      {
        title: "Televisores",
        warrantyPeriod: "12 Meses",
        description: "Período de Garantía"
      },
      {
        title: "Soundbars",
        warrantyPeriod: "12 Meses",
        description: "Período de Garantía"
      },
      {
        title: "Accesorios AV",
        warrantyPeriod: "12 Meses",
        description: "Período de Garantía"
      }
    ]
  },
  {
    id: "electrodomesticos",
    name: "ELECTRODOMÉSTICOS",
    products: [
      {
        title: "Refrigeradores",
        warrantyPeriod: "12 Meses",
        description: "Período de Garantía"
      },
      {
        title: "Lavadoras",
        warrantyPeriod: "12 Meses",
        description: "Período de Garantía"
      },
      {
        title: "Microondas",
        warrantyPeriod: "12 Meses",
        description: "Período de Garantía"
      }
    ]
  },
  {
    id: "corporativo",
    name: "CORPORATIVO",
    products: [
      {
        title: "Pantallas Comerciales",
        warrantyPeriod: "24 Meses",
        description: "Período de Garantía"
      },
      {
        title: "Soluciones Empresariales",
        warrantyPeriod: "12 Meses",
        description: "Período de Garantía"
      }
    ]
  }
];

export function WarrantyCategoriesSection() {
  const [activeCategory, setActiveCategory] = useState("movil");

  const currentCategory = categories.find(cat => cat.id === activeCategory);

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
          ¿Qué incluye tu garantía?
        </h2>

        {/* Category Tabs */}
        <div className="mb-12">
          <div className="bg-black">
            <div className="flex flex-col sm:flex-row">
              {categories.map((category) => (
                 <button
                   key={category.id}
                   onClick={() => setActiveCategory(category.id)}
                   className={`flex-1 px-4 py-4 font-bold text-xs sm:text-sm transition-all duration-200 relative ${
                     activeCategory === category.id
                       ? "bg-gray-800 text-white"
                       : "bg-gray-600 text-white hover:bg-gray-700"
                   }`}
                 >
                   {category.name}
                   {activeCategory === category.id && (
                     <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white"></div>
                   )}
                 </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards Layout */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategory?.products.map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
                {/* Card Header */}
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-300">
                  <h3 className="text-lg font-bold text-gray-900 text-center">{product.title}</h3>
                </div>
                
                {/* Card Body */}
                <div className="p-6 bg-white">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <div className="flex flex-col items-center">
                      <span className="text-5xl font-black text-gray-800 leading-none">{product.warrantyPeriod.split(' ')[0]}</span>
                      <p className="text-sm text-gray-600 mt-1">{product.warrantyPeriod.split(' ')[1]}</p>
                    </div>
                  </div>

                  {product.note && (
                    <p className="text-xs text-gray-500 mb-3">{product.note}</p>
                  )}
                  
                  {product.items && (
                    <div className="space-y-2">
                      {product.items.slice(0, 2).map((item, itemIndex) => (
                        <div key={itemIndex} className="text-sm text-gray-700">
                          {item}
                        </div>
                      ))}
                      {product.items.length > 2 && (
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                          MOSTRAR MÁS
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
