/**
 * Footer del Sitio Web - Diseño Samsung Store
 * - Layout en columnas (6 columnas en desktop)
 * - Enlaces organizados por categorías
 * - Código modular y escalable
 * - Redes sociales y enlaces legales
 * - Animaciones elegantes
 */

"use client";

import { useState, useEffect } from "react";
import { footerSections } from "./footer/footer-config";
import { FooterColumn } from "./footer/FooterColumn";
import { FooterBottom } from "./footer/FooterBottom";

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  // Animación de entrada al montar
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <footer
      className={`bg-white border-t border-gray-200 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <div className="px-4 xl:px-10 py-8 md:py-12">
        {/* Columnas principales - Mobile: Acordeón */}
        <div className="md:hidden">
          {footerSections.map((section, index) => (
            <FooterColumn
              key={section.title}
              section={section}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Columnas principales - Desktop: Grid de 5 columnas con divisores */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 lg:gap-6 divide-x divide-gray-200 items-start">
          {footerSections.map((section, index) => (
            <div key={section.title || `section-${index}`} className={index === 0 ? "" : "pl-8 lg:pl-6"}>
              <FooterColumn
                section={section}
                index={index}
                isVisible={isVisible}
              />
            </div>
          ))}
        </div>

        {/* Sección inferior */}
        <FooterBottom isVisible={isVisible} />
      </div>
    </footer>
  );
}

export { Footer };
export default Footer;
