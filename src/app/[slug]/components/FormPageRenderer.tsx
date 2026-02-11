/**
 * Renderer para páginas de tipo formulario
 * Maneja diferentes layouts: banner arriba, izquierda, derecha, detrás, o solo formulario
 * En mobile (<lg), todos los layouts se renderizan como banner_top
 */

"use client";

import MultimediaBannerCarousel from "./MultimediaBannerCarousel";
import DynamicFormSection from "./DynamicFormSection";
import FAQAccordion from "./FAQAccordion";
import type {
  MultimediaPage,
  MultimediaPageBanner,
  MultimediaPageFAQ,
} from "@/services/multimedia-pages.service";

interface FormPageRendererProps {
  pageData: MultimediaPage;
  banners: MultimediaPageBanner[];
  faqs: MultimediaPageFAQ[];
}

export default function FormPageRenderer({
  pageData,
  banners,
  faqs,
}: FormPageRendererProps) {
  const layout = pageData.form_layout || { type: "form_only" };
  const hasBanners = banners && banners.length > 0;
  const activeFaqs = faqs.filter(f => f.activo !== false);

  // Render based on layout type
  // Mobile always renders as banner_top; desktop respects the selected layout
  switch (layout.type) {
    case "banner_top":
      return (
        <div
          className="min-h-screen -mt-12"
          style={{ backgroundColor: layout.background_color }}
        >
          {hasBanners && <MultimediaBannerCarousel banners={banners} />}
          <div className="max-w-4xl mx-auto px-4 py-8">
            <DynamicFormSection pageData={pageData} />
          </div>
          {activeFaqs.length > 0 && <FAQAccordion faqs={activeFaqs} />}
        </div>
      );

    case "banner_left":
      return (
        <div
          className="min-h-screen -mt-12 lg:mt-0 lg:min-h-[80vh]"
          style={{ backgroundColor: layout.background_color }}
        >
          {/* Mobile: hero banner on top */}
          {hasBanners && (
            <div className="lg:hidden">
              <MultimediaBannerCarousel banners={banners} />
            </div>
          )}
          <div className="lg:flex lg:min-h-[80vh] lg:px-8 lg:pt-4 lg:gap-6">
            {/* Desktop: side banner on left */}
            {hasBanners && (
              <div
                className="hidden lg:block flex-shrink-0"
                style={{ width: `${layout.banner_width || 30}%` }}
              >
                <div className="sticky top-16 h-[80vh]">
                  <MultimediaBannerCarousel banners={banners} variant="side" />
                </div>
              </div>
            )}
            <div className="flex-1 px-4 py-8 lg:flex lg:flex-col lg:justify-center">
              <div className="w-full">
                <DynamicFormSection pageData={pageData} />
              </div>
              {activeFaqs.length > 0 && (
                <div className="w-full mt-8">
                  <FAQAccordion faqs={activeFaqs} />
                </div>
              )}
            </div>
          </div>
        </div>
      );

    case "banner_right":
      return (
        <div
          className="min-h-screen -mt-12 lg:mt-0 lg:min-h-[80vh]"
          style={{ backgroundColor: layout.background_color }}
        >
          {/* Mobile: hero banner on top */}
          {hasBanners && (
            <div className="lg:hidden">
              <MultimediaBannerCarousel banners={banners} />
            </div>
          )}
          <div className="lg:flex lg:min-h-[80vh] lg:px-8 lg:pt-4 lg:gap-6">
            <div className="flex-1 px-4 py-8 lg:flex lg:flex-col lg:justify-center">
              <div className="w-full">
                <DynamicFormSection pageData={pageData} />
              </div>
              {activeFaqs.length > 0 && (
                <div className="w-full mt-8">
                  <FAQAccordion faqs={activeFaqs} />
                </div>
              )}
            </div>
            {/* Desktop: side banner on right */}
            {hasBanners && (
              <div
                className="hidden lg:block flex-shrink-0"
                style={{ width: `${layout.banner_width || 30}%` }}
              >
                <div className="sticky top-16 h-[80vh]">
                  <MultimediaBannerCarousel banners={banners} variant="side" />
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case "banner_behind":
      return (
        <div className="min-h-screen -mt-12 lg:relative">
          {hasBanners && (
            <>
              {/* Mobile: hero banner on top */}
              <div className="lg:hidden">
                <MultimediaBannerCarousel banners={banners} />
              </div>
              {/* Desktop: fullscreen behind */}
              <div className="hidden lg:block absolute inset-0">
                <div className="h-screen sticky top-0">
                  <MultimediaBannerCarousel banners={banners} variant="fullscreen" />
                </div>
                <div
                  className="absolute inset-0 bg-black"
                  style={{ opacity: layout.banner_overlay_opacity || 0.5 }}
                />
              </div>
            </>
          )}
          <div className="max-w-4xl mx-auto lg:max-w-none px-4 py-8 lg:relative lg:z-10 lg:min-h-screen lg:flex lg:flex-col lg:items-center lg:justify-center">
            <DynamicFormSection pageData={pageData} />
          </div>
          {activeFaqs.length > 0 && (
            <div className="lg:relative lg:z-10">
              <FAQAccordion faqs={activeFaqs} />
            </div>
          )}
        </div>
      );

    case "form_only":
    default:
      return (
        <div
          className="min-h-screen -mt-12 pt-16"
          style={{ backgroundColor: layout.background_color }}
        >
          <div className="max-w-4xl mx-auto px-4 py-12">
            <DynamicFormSection pageData={pageData} />
          </div>
          {activeFaqs.length > 0 && <FAQAccordion faqs={activeFaqs} />}
        </div>
      );
  }
}
