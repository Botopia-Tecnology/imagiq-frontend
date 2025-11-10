"use client";
/**
 * ⭐ REVIEWS SLIDER COMPONENT - IMAGIQ ECOMMERCE
 *
 * - Slider de opiniones de clientes, idéntico al diseño de la imagen
 * - Funcionalidad de slider responsivo y accesible
 * - Código limpio, documentado y escalable
 * - Experiencia de usuario premium
 */

import { useState, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import reviews from "@/app/productos/components/utils/reviews";

// Función para generar colores aleatorios para las iniciales
const getRandomColor = () => {
  const colors = [
    "bg-blue-500 text-white",
    "bg-green-500 text-white",
    "bg-purple-500 text-white",
    "bg-pink-500 text-white",
    "bg-orange-500 text-white",
    "bg-teal-500 text-white",
    "bg-indigo-500 text-white",
    "bg-red-500 text-white",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Función para obtener el primer nombre
const getFirstName = (fullName: string) => {
  return fullName.split(" ")[0];
};

// Función para obtener la inicial
const getInitial = (name: string) => {
  return name.charAt(0).toUpperCase();
};

// Datos de las reseñas (pueden venir de props, API, etc.)
// const reviews = [
//   {
//     id: 1,
//     name: "Carlos P.",
//     initial: "C",
//     color: "bg-green-200 text-gray-700",
//     text: "Llevo dos semanas con mi nuevo Galaxy y me parece increíble la batería. Dura todo el día sin problema. Además, el diseño es espectacular.",
//   },
//   {
//     id: 2,
//     name: "Laura M.",
//     initial: "L",
//     color: "bg-blue-500 text-white",
//     text: "Excelente experiencia de compra, la atención fue rápida y pude resolver todas mis dudas con el asistente virtual. El Galaxy S25 superó mis expectativas.",
//   },
//   {
//     id: 3,
//     name: "Andrés R.",
//     initial: "A",
//     color: "bg-orange-600 text-white",
//     text: "El proceso de entrega fue muy ágil y el celular llegó en perfectas condiciones. Me encantó la pantalla y la cámara, realmente impresionantes.",
//   },
//   {
//     id: 4,
//     name: "Valentina C.",
//     initial: "V",
//     color: "bg-pink-300 text-white",
//     text: "Muy buen producto, aunque me costó un poco configurar algunas funciones al inicio. El soporte técnico me ayudó en minutos. ¡Muy recomendados!",
//   },
// ];

const Reviews = () => {
  const [active, setActive] = useState(0); // Index de la card central
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filtrar solo reviews con rating >= 4
  const filteredReviews = useMemo(() => {
    return reviews.filter(review => review.review_rating >= 4);
  }, []);

  // Generar colores aleatorios una sola vez para cada review
  const reviewsWithColors = useMemo(() => {
    return filteredReviews.map(review => ({
      ...review,
      color: getRandomColor(),
      firstName: getFirstName(review.author_title),
      initial: getInitial(review.author_title)
    }));
  }, [filteredReviews]);

  // Obtener 3 cards para mostrar en el carrusel
  const getVisibleCards = () => {
    const total = reviewsWithColors.length;
    if (total === 0) return [];

    const prevIndex = (active - 1 + total) % total;
    const nextIndex = (active + 1) % total;

    return [
      reviewsWithColors[prevIndex],
      reviewsWithColors[active],
      reviewsWithColors[nextIndex]
    ];
  };

  // Slider navigation
  const handlePrev = () => {
    setActive((prev) => (prev - 1 + reviewsWithColors.length) % reviewsWithColors.length);
  };

  const handleNext = () => {
    setActive((prev) => (prev + 1) % reviewsWithColors.length);
  };

  return (
    <section className="w-full py-14 bg-white md:mb-0 pb-10">
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
        <div className="w-full">
          {/* Desktop/tablet slider */}
          <div className="md:flex items-center justify-center min-h-[370px] w-full hidden">
            {/* Prev button fuera del slider */}
            <div className="flex items-center h-full">
              <button
                aria-label="Anterior"
                onClick={handlePrev}
                className="md:flex hidden items-center justify-center shadow-lg hover:brightness-95 transition"
                style={{
                  zIndex: 30,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  width: 40,
                  height: 40,
                  backgroundColor: "#ffffff",
                  color: "#222",
                  border: "1px solid #e5e7eb",
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
                    stroke="#222"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            {/* Cards desktop/tablet */}
            <div className="flex gap-8 w-full justify-center items-center">
              {getVisibleCards().map((review, index) => {
                const isActive = index === 1; // La card del medio (index 1) es la activa

                let opacity = isActive ? 1 : 0.4;
                let scale = isActive ? 1 : 0.9;
                let zIndex = isActive ? 10 : 1;
                let shadow = isActive ? "0 4px 16px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.04)";
                let border = "1px solid #E5E7EB";

                return (
                  <a
                    key={`${review.author_id}-${index}`}
                    href={review.review_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "relative flex flex-col items-center transition-all duration-500 cursor-pointer hover:shadow-xl",
                    )}
                    style={{
                      boxShadow: shadow,
                      border,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      padding: "32px 24px",
                      height: "340px",
                      maxWidth: "340px",
                      width: "340px",
                      opacity,
                      zIndex,
                      transform: `scale(${scale})`,
                      transition:
                        "box-shadow 0.3s, transform 0.3s, opacity 0.3s",
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
                      {review.firstName}
                    </div>
                    {/* Stars */}
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="24"
                          height="24"
                          fill="#FFD700"
                          stroke="#FFD700"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          className="mx-0.5"
                        >
                          <polygon
                            points="12,2 15,8.5 22,9.3 17,14.1 18.5,21 12,17.7 5.5,21 7,14.1 2,9.3 9,8.5"
                          />
                        </svg>
                      ))}
                    </div>
                    {/* Text */}
                    <div
                      className="text-base text-gray-700 text-center leading-relaxed mt-2 overflow-hidden"
                      style={{
                        fontFamily: "Samsung Sharp Sans, sans-serif",
                        fontSize: "1.08rem",
                        marginTop: 8,
                        lineHeight: 1.4,
                        maxWidth: 260,
                        height: "120px",
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {review.review_text}
                    </div>
                  </a>
                );
              })}
            </div>
            {/* Next button fuera del slider */}
            <div className="flex items-center h-full">
              <button
                aria-label="Siguiente"
                onClick={handleNext}
                className="md:flex hidden items-center justify-center shadow-lg hover:brightness-95 transition"
                style={{
                  zIndex: 30,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  width: 40,
                  height: 40,
                  backgroundColor: "#ffffff",
                  color: "#222",
                  border: "1px solid #e5e7eb",
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
                    stroke="#222"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* Mobile slider: carrusel auto-scroll infinito real, sin repetir manualmente las cards */}
          <div className="md:hidden w-full overflow-x-hidden p-0 m-0">
            {/* Carrusel infinito mobile: animación fluida y continua */}
            <div
              ref={scrollRef}
              className="flex flex-nowrap gap-20 w-[calc(70vw_*_16)] animate-reviews-infinito-mobile"
              style={{ animationDuration: `${reviewsWithColors.length * 12}s` }}
              role="list"
              aria-label="Opiniones de clientes"
            >
              {/* Duplicamos las reviews para loop infinito, sin cortes */}
              {[...reviewsWithColors, ...reviewsWithColors, ...reviewsWithColors, ...reviewsWithColors].map(
                (review, idx) => (
                  <a
                    key={idx}
                    href={review.review_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "relative flex flex-col items-center transition-all duration-500 bg-gray-100 border border-gray-200 min-w-[70vw] w-[70vw] max-w-[70vw] snap-center shadow-lg cursor-pointer"
                    )}
                    style={{
                      height: "340px",
                      padding: "32px 16px",
                      boxShadow: "0 12px 36px rgba(0,0,0,0.13)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      opacity: 1,
                      zIndex: 10,
                      transform: "scale(1)",
                      transition:
                        "box-shadow 0.3s, transform 0.3s, opacity 0.3s",
                    }}
                    aria-label={review.firstName}
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
                      {review.firstName}
                    </div>
                    {/* Stars */}
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          width="24"
                          height="24"
                          fill="#FFD700"
                          stroke="#FFD700"
                          strokeWidth="1"
                          viewBox="0 0 24 24"
                          className="mx-0.5"
                        >
                          <polygon
                            points="12,2 15,8.5 22,9.3 17,14.1 18.5,21 12,17.7 5.5,21 7,14.1 2,9.3 9,8.5"
                          />
                        </svg>
                      ))}
                    </div>
                    {/* Text */}
                    <div
                      className="text-base text-gray-700 text-center leading-relaxed mt-2 overflow-hidden"
                      style={{
                        fontFamily: "Samsung Sharp Sans, sans-serif",
                        fontSize: "1.08rem",
                        marginTop: 8,
                        lineHeight: 1.4,
                        maxWidth: 260,
                        height: "120px",
                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {review.review_text}
                    </div>
                  </a>
                )
              )}
            </div>
            {/* Animación infinita mobile */}
            <style jsx>{`
              @keyframes reviews-infinito-mobile {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              .animate-reviews-infinito-mobile {
                animation: reviews-infinito-mobile linear infinite;
                width: max-content;
              }
            `}</style>
          </div>
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
