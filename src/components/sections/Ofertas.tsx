/**
 * 🌟 FEATURED PRODUCTS SECTION - IMAGIQ ECOMMERCE
 *
 * Sección de productos destacados con:
 * - Grid de productos populares
 * - Integración con sistema de carrito
 * - Tracking de visualizaciones de productos
 */

"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import oferta1 from "../../img/ofertas/oferta1.gif";
import oferta2 from "../../img/ofertas/oferta2.png";
import oferta3 from "../../img/ofertas/oferta3.png";

const ofertasData = [
  {
    id: 1,
    title: "Samsung Galaxy A55 / 5G 8GB 256GB / Azul oscuro",
    image: oferta1,
    discount: null,
  },
  {
    id: 2,
    title: "Samsung Galaxy A55 / 5G 8GB 256GB / Azul oscuro",
    image: oferta2,
    discount: "-13%",
    hasGalaxyAI: true,
  },
  {
    id: 3,
    title: "Samsung Galaxy A55 / 5G 8GB 256GB / Azul oscuro",
    image: oferta3,
    discount: "-3%",
  },
];

export const Ofertas = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);

  // Update visible items based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleItems(1); // Mobile: show 1 item
      } else if (window.innerWidth < 1024) {
        setVisibleItems(3); // Tablet: show 3 items
      } else {
        setVisibleItems(3); // Desktop: show 3 items
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (currentIndex < ofertasData.length - visibleItems) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Loop back to beginning
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Loop to end
      setCurrentIndex(ofertasData.length - visibleItems);
    }
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-800 lg:text-3xl md:text-2xl sm:text-xl">
          Ofertas para ti
        </h2>

        <div className="relative flex items-center max-w-7xl mx-auto">
          {/* Left navigation arrow - outside card */}
          <button
            className="hidden md:flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100 hover:shadow-lg transition-all duration-300 z-10 mr-6"
            onClick={prevSlide}
            aria-label="Ver ofertas anteriores"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          {/* Large single card containing products */}
          <div className="bg-[#C8D7E8] rounded-3xl overflow-hidden shadow-sm p-4 md:p-8 flex-1 relative">
            {/* Mobile navigation arrows - inside card */}
            <button
              className="md:hidden absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-all duration-300 z-10"
              onClick={prevSlide}
              aria-label="Ver ofertas anteriores"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <button
              className="md:hidden absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100 transition-all duration-300 z-10"
              onClick={nextSlide}
              aria-label="Ver más ofertas"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>

            {/* Desktop: Grid layout */}
            <div className="hidden md:grid grid-cols-3 gap-8 items-center">
              {ofertasData.map((oferta) => (
                <div
                  key={oferta.id}
                  className="relative flex flex-col items-center"
                >
                  {oferta.discount && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-full text-sm z-10">
                      {oferta.discount}
                    </div>
                  )}

                  <div className="w-full flex justify-center py-6 h-80">
                    <Image
                      src={oferta.image}
                      alt={oferta.title}
                      width={300}
                      height={300}
                      className="object-contain max-h-full transition-transform duration-300"
                      unoptimized={true}
                    />
                  </div>

                  <h3 className="text-sm font-medium text-center mt-4 text-gray-800 px-2">
                    {oferta.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Mobile: Slider layout */}
            <div className="md:hidden overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                  width: `${ofertasData.length * 100}%`,
                }}
              >
                {ofertasData.map((oferta) => (
                  <div
                    key={oferta.id}
                    className="relative flex flex-col items-center px-4"
                    style={{ width: `${100 / ofertasData.length}%` }}
                  >
                    {oferta.discount && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white font-bold py-1 px-3 rounded-full text-xs z-10">
                        {oferta.discount}
                      </div>
                    )}

                    <div className="w-full flex justify-center py-4 h-48">
                      <Image
                        src={oferta.image}
                        alt={oferta.title}
                        width={200}
                        height={200}
                        className="object-contain max-h-full transition-transform duration-300"
                        unoptimized={true}
                      />
                    </div>

                    <h3 className="text-xs font-medium text-center mt-2 text-gray-800 px-2">
                      {oferta.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right navigation arrow - outside card (desktop only) */}
          <button
            className="hidden md:flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-md text-gray-700 hover:bg-gray-100 hover:shadow-lg transition-all duration-300 z-10 ml-6"
            onClick={nextSlide}
            aria-label="Ver más ofertas"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

