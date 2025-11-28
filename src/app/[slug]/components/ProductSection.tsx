/**
 * Sección de productos para landing pages con sistema de tabs
 * Muestra pestañas para cada sección y filtra productos según la selección
 */

'use client';

import { useState } from 'react';
import type { ProductSection as ProductSectionType, ProductCardData } from '@/services/multimedia-pages.service';
import CustomProductCard from './CustomProductCard';

interface ProductSectionProps {
  sections: ProductSectionType[];
  productCards: ProductCardData[];
}

export default function ProductSection({ sections, productCards }: ProductSectionProps) {
  // Ordenar secciones y seleccionar la primera por defecto
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const [activeSection, setActiveSection] = useState(sortedSections[0]?.id || '');

  if (sortedSections.length === 0 || productCards.length === 0) {
    return null;
  }

  // Obtener la sección activa
  const currentSection = sortedSections.find(s => s.id === activeSection) || sortedSections[0];
  
  // Filtrar las product cards de la sección activa
  const sectionProducts = productCards.filter(card => 
    currentSection.product_card_ids.includes(card.id)
  );

  return (
    <section className="w-full bg-white py-8 md:py-12">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1440px' }}>
        {/* Tabs de secciones */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
            {sortedSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm md:text-base
                  transition-colors duration-200
                  ${activeSection === section.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {section.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Grid de productos de la sección activa */}
        {sectionProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {sectionProducts.map((product) => (
              <CustomProductCard
                key={product.id}
                card={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No hay productos disponibles en esta sección
          </div>
        )}
      </div>
    </section>
  );
}
