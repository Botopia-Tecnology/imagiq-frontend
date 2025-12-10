/**
 * Cliente de página multimedia
 */

'use client';

import MultimediaBannerCarousel from './MultimediaBannerCarousel';
import ProductSection from './ProductSection';
import FAQAccordion from './FAQAccordion';
import type { MultimediaPageData } from '@/services/multimedia-pages.service';

interface MultimediaPageClientProps {
  pageData: MultimediaPageData;
}

export default function MultimediaPageClient({ pageData }: MultimediaPageClientProps) {
  const { page, banners, faqs, product_cards } = pageData;

  return (
    <div className="min-h-screen bg-white -mt-12">
      {/* Carrusel de Banners */}
      <MultimediaBannerCarousel banners={banners} />

      {/* Sección de Título y Descripción de Productos */}
      {(page.products_section_title || page.products_section_description) && (
        <section className="w-full bg-white py-6 md:py-8">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1440px' }}>
            {page.products_section_title && (
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {page.products_section_title}
              </h2>
            )}
            {page.products_section_description && (
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8">
                {page.products_section_description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Secciones de Productos con Tabs */}
      {page.sections && page.sections.length > 0 && product_cards && (
        <ProductSection
          sections={page.sections}
          productCards={product_cards}
        />
      )}

      {/* FAQs con Acordeón */}
      {faqs.length > 0 && <FAQAccordion faqs={faqs} />}
    </div>
  );
}
