/**
 * Cliente de página multimedia
 */

'use client';

import MultimediaBannerCarousel from './MultimediaBannerCarousel';
import type { MultimediaPageData } from '@/services/multimedia-pages.service';

interface MultimediaPageClientProps {
  pageData: MultimediaPageData;
}

export default function MultimediaPageClient({ pageData }: MultimediaPageClientProps) {
  const { page, banners, faqs } = pageData;

  return (
    <div className="min-h-screen bg-white">
      {/* Carrusel de Banners */}
      <MultimediaBannerCarousel banners={banners} />

      {/* Sección de Título y Descripción de Productos */}
      {(page.products_section_title || page.products_section_description) && (
        <section className="w-full bg-white py-12 md:py-16">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1440px' }}>
            {page.products_section_title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {page.products_section_title}
              </h2>
            )}
            {page.products_section_description && (
              <p className="text-semibold md:text-lg lg:text-xl text-gray-600">
                {page.products_section_description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* FAQs - Temporal para testing */}
      {faqs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Preguntas Frecuentes</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(faqs, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
