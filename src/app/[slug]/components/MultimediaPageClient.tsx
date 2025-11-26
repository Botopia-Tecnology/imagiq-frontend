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
  const { banners, faqs } = pageData;

  return (
    <div className="min-h-screen bg-white">
      {/* Carrusel de Banners */}
      <MultimediaBannerCarousel banners={banners} />

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
