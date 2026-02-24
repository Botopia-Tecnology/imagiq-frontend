'use client';

import dynamic from 'next/dynamic';
import MultimediaBannerCarousel from './MultimediaBannerCarousel';
import ProductSection from './ProductSection';
import FAQAccordion from './FAQAccordion';
import { LiveStreamSkeleton } from './livestream';
import type {
  MultimediaPage,
  MultimediaPageBanner,
  MultimediaPageFAQ,
  ProductCardData,
} from '@/services/multimedia-pages.service';

const LiveStreamSection = dynamic(
  () => import('./livestream/LiveStreamSection'),
  { ssr: false, loading: () => <LiveStreamSkeleton /> },
);

interface LiveStreamPageRendererProps {
  pageData: MultimediaPage;
  banners: MultimediaPageBanner[];
  faqs: MultimediaPageFAQ[];
  productCards: ProductCardData[];
}

export default function LiveStreamPageRenderer({
  pageData,
  banners,
  faqs,
  productCards,
}: LiveStreamPageRendererProps) {
  return (
    <div className="min-h-screen bg-white -mt-12">
      {/* Optional banners above the stream */}
      {banners.length > 0 && <MultimediaBannerCarousel banners={banners} />}

      {/* Livestream embed */}
      {pageData.livestream_config && (
        <LiveStreamSection config={pageData.livestream_config} />
      )}

      {/* Product title and description */}
      {(pageData.products_section_title || pageData.products_section_description) && (
        <section className="w-full bg-white py-6 md:py-8">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8" style={{ maxWidth: '1440px' }}>
            {pageData.products_section_title && (
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                {pageData.products_section_title}
              </h2>
            )}
            {pageData.products_section_description && (
              <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8">
                {pageData.products_section_description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Product sections */}
      {pageData.sections && pageData.sections.length > 0 && productCards && (
        <ProductSection sections={pageData.sections} productCards={productCards} />
      )}

      {/* FAQs */}
      {faqs.length > 0 && <FAQAccordion faqs={faqs} />}
    </div>
  );
}
