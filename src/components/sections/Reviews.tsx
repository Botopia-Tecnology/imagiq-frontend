"use client";
/**
 * ⭐ REVIEWS SLIDER COMPONENT - IMAGIQ ECOMMERCE
 *
 * - Slider de opiniones de clientes, idéntico al diseño de la imagen
 * - Funcionalidad de slider responsivo y accesible
 * - Código limpio, documentado y escalable
 * - Experiencia de usuario premium
 */

import { useState } from "react";
import { cn } from "@/lib/utils";

// Datos de las reseñas (pueden venir de props, API, etc.)
const reviews = [
  {
    id: 1,
    name: "Carlos P.",
    initial: "C",
    color: "bg-green-200 text-gray-700",
    text: "Llevo dos semanas con mi nuevo Galaxy y me parece increíble la batería. Dura todo el día sin problema. Además, el diseño es espectacular.",
  },
  {
    id: 2,
    name: "Laura M.",
    initial: "L",
    color: "bg-blue-500 text-white",
    text: "Excelente experiencia de compra, la atención fue rápida y pude resolver todas mis dudas con el asistente virtual. El Galaxy S25 superó mis expectativas.",
  },
  {
    id: 3,
    name: "Andrés R.",
    initial: "A",
    color: "bg-orange-600 text-white",
    text: "El proceso de entrega fue muy ágil y el celular llegó en perfectas condiciones. Me encantó la pantalla y la cámara, realmente impresionantes.",
  },
  {
    id: 4,
    name: "Valentina C.",
    initial: "V",
    color: "bg-pink-300 text-white",
    text: "Muy buen producto, aunque me costó un poco configurar algunas funciones al inicio. El soporte técnico me ayudó en minutos. ¡Muy recomendados!",
  },
];

const Reviews = () => {
  const [active, setActive] = useState(2); // Centrar la segunda reseña por defecto

  // Slider navigation
  const handlePrev = () =>
    setActive((prev) => (prev === 1 ? reviews.length : prev - 1));
  const handleNext = () =>
    setActive((prev) => (prev === reviews.length ? 1 : prev + 1));

  // Responsive: show 1 on mobile, 4 on desktop
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const getVisibleReviews = () => {
    if (isMobile) {
      return reviews.filter((r) => r.id === active);
    }
    // Desktop: show all, center active visually
    return reviews;
  };

  return (
    <section className="w-full py-14 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Títulos */}
        <h2
          className="text-4xl font-bold text-center mb-2 tracking-tight"
          style={{ fontFamily: "Samsung Sharp Sans, sans-serif" }}
        >
          Lo que dicen nuestros clientes
        </h2>
        <p className="text-center text-xl text-gray-600 mb-10">
          Opiniones verificadas de usuarios en Google
        </p>

        {/* Slider */}
        <div className="flex items-center justify-center min-h-[370px] w-full">
          {/* Prev button fuera del slider */}
          <div className="flex items-center h-full">
            <button
              aria-label="Anterior"
              onClick={handlePrev}
              className="md:flex hidden items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
              style={{
                zIndex: 30,
                boxShadow: "0 4px 16px rgba(37,99,235,0.15)",
                width: 40,
                height: 40,
              }}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          {/* Cards */}
          <div className="flex gap-8 w-full justify-center items-end">
            {getVisibleReviews().map((review) => {
              let opacity = 1;
              let scale = 1;
              let zIndex = 1;
              let shadow = "0 2px 8px rgba(0,0,0,0.04)";
              let border = "1px solid #E5E7EB";
              const bg = active === review.id ? "bg-white" : "bg-gray-50";
              if (!isMobile) {
                if (review.id === active) {
                  scale = 1.08;
                  zIndex = 10;
                  shadow = "0 8px 32px rgba(0,0,0,0.10)";
                  opacity = 1;
                  border = "1.5px solid #E5E7EB";
                } else if (
                  review.id === active - 1 ||
                  (active === 1 && review.id === reviews.length)
                ) {
                  scale = 0.95;
                  zIndex = 5;
                  shadow = "0 2px 8px rgba(0,0,0,0.04)";
                  opacity = 0.7;
                } else if (
                  review.id === active + 1 ||
                  (active === reviews.length && review.id === 1)
                ) {
                  scale = 0.95;
                  zIndex = 5;
                  shadow = "0 2px 8px rgba(0,0,0,0.04)";
                  opacity = 0.7;
                } else {
                  scale = 0.9;
                  zIndex = 1;
                  opacity = 0.4;
                }
              }
              return (
                <div
                  key={review.id}
                  className={cn(
                    "relative rounded-2xl flex flex-col items-center transition-all duration-500",
                    bg
                  )}
                  aria-current={active === review.id ? "true" : undefined}
                  style={{
                    boxShadow: shadow,
                    borderRadius: "24px",
                    border,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    padding: "32px 24px",
                    minHeight: "340px",
                    maxWidth: "340px",
                    width: isMobile ? "100%" : "340px",
                    opacity,
                    zIndex,
                    transform: `scale(${scale})`,
                    transition: "box-shadow 0.3s, transform 0.3s, opacity 0.3s",
                  }}
                >
                  {/* Initial circle */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-3",
                      review.color
                    )}
                    style={{
                      fontFamily: "Samsung Sharp Sans, sans-serif",
                      fontSize: "1.35rem",
                    }}
                  >
                    {review.initial}
                  </div>
                  {/* Name */}
                  <div
                    className="font-bold text-gray-800 mb-2 text-center text-lg"
                    style={{
                      fontFamily: "Samsung Sharp Sans, sans-serif",
                      fontSize: "1.15rem",
                    }}
                  >
                    {review.name}
                  </div>
                  {/* Stars */}
                  <div className="flex justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        width="24"
                        height="24"
                        fill="none"
                        stroke="#BDBDBD"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="mx-0.5"
                      >
                        <polygon
                          points="12,2 15,8.5 22,9.3 17,14.1 18.5,21 12,17.7 5.5,21 7,14.1 2,9.3 9,8.5"
                          fill="#BDBDBD"
                        />
                      </svg>
                    ))}
                  </div>
                  {/* Text */}
                  <div
                    className="text-base text-gray-700 text-center leading-relaxed mt-2"
                    style={{
                      fontFamily: "Samsung Sharp Sans, sans-serif",
                      fontSize: "1.08rem",
                      marginTop: 8,
                      lineHeight: 1.4,
                      maxWidth: 260,
                      minHeight: 110,
                      display: "flex",
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    {review.text}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Next button fuera del slider */}
          <div className="flex items-center h-full">
            <button
              aria-label="Siguiente"
              onClick={handleNext}
              className="md:flex hidden items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
              style={{
                zIndex: 30,
                boxShadow: "0 4px 16px rgba(37,99,235,0.15)",
                width: 40,
                height: 40,
              }}
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-10">
          <button
            className="bg-blue-600 text-white font-semibold rounded-full px-8 py-3 shadow-lg hover:bg-blue-700 transition text-lg"
            aria-label="Ver más reseñas"
            style={{
              fontFamily: "Samsung Sharp Sans, sans-serif",
              minWidth: 240,
              fontSize: "1.15rem",
              boxShadow: "0 4px 16px rgba(37,99,235,0.15)",
            }}
            onClick={() =>
              window.open(
                "https://www.google.com/search?q=samsung+store+reviews",
                "_blank"
              )
            }
          >
            Ver más reseñas
          </button>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
