"use client";
/**
 * ⭐ REVIEWS SLIDER COMPONENT - IMAGIQ ECOMMERCE
 *
 * - Slider de opiniones de clientes, idéntico al diseño de la imagen
 * - Funcionalidad de slider responsivo y accesible
 * - Código limpio, documentado y escalable
 * - Experiencia de usuario premium
 */

import { useState, useMemo } from "react";
import reviews from "@/app/productos/components/utils/reviews";
import { getColorFromId, getFirstName, getInitial, GOOGLE_REVIEWS_URL } from "./reviews/utils";
import { ReviewsHeader } from "./reviews/ReviewsHeader";
import { DesktopSlider } from "./reviews/DesktopSlider";
import { MobileSlider } from "./reviews/MobileSlider";

const Reviews = () => {
  const [active, setActive] = useState(0);

  // Filtrar solo reviews con rating >= 4 y agregar datos procesados
  const reviewsWithColors = useMemo(() => {
    return reviews
      .filter((review) => review.review_rating >= 4)
      .map((review) => ({
        ...review,
        color: getColorFromId(review.author_id),
        firstName: getFirstName(review.author_title),
        initial: getInitial(review.author_title),
      }));
  }, []);

  // Obtener 3 cards para mostrar en el carrusel desktop
  const getVisibleCards = () => {
    const total = reviewsWithColors.length;
    if (total === 0) return [];

    const prevIndex = (active - 1 + total) % total;
    const nextIndex = (active + 1) % total;

    return [
      reviewsWithColors[prevIndex],
      reviewsWithColors[active],
      reviewsWithColors[nextIndex],
    ];
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + reviewsWithColors.length) % reviewsWithColors.length);
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % reviewsWithColors.length);
  };

  return (
    <section className="w-full py-14 bg-white md:mb-0 pb-10">
      <div className="max-w-6xl mx-auto px-4">
        <ReviewsHeader />

        {/* Sliders */}
        <div className="w-full">
          <DesktopSlider
            visibleCards={getVisibleCards()}
            onPrev={handlePrev}
            onNext={handleNext}
          />
          <MobileSlider reviews={reviewsWithColors} />
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-10">
          <button
            className="font-semibold rounded-full px-8 py-3 shadow-lg hover:brightness-95 transition text-lg"
            aria-label="Ver más reseñas"
            style={{
              fontFamily: "Samsung Sharp Sans, sans-serif",
              minWidth: 240,
              fontSize: "1.15rem",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              backgroundColor: "#000000",
              color: "#ffffff",
            }}
            onClick={() => window.open(GOOGLE_REVIEWS_URL, "_blank")}
          >
            Ver más reseñas
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
