/**
 * Footer del Sitio Web - Diseño Samsung Store
 * - Layout en columnas idéntico al de la imagen
 * - Links organizados por categorías
 * - Código limpio y escalable
 * - Excelente UX con tracking de PostHog
 * - Animaciones elegantes con Tailwind CSS
 */

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { posthogUtils } from "@/lib/posthogClient";
import Logo from "./Logo";

// Footer data structure matching the image
const footerSections = [
  {
    title: "Productos y servicios",
    links: [
      { name: "Lanzamientos", href: "/lanzamientos" },
      { name: "Outlet", href: "/outlet" },
      { name: "Ofertas", href: "/ofertas" },
      { name: "Sin categorizar", href: "/sin-categorizar" },
      { name: "Mobile", href: "/mobile" },
      { name: "TV y Audio", href: "/tv-audio" },
      { name: "Electrodomésticos", href: "/electrodomesticos" },
      { name: "Informática", href: "/informatica" },
    ],
  },
  {
    title: "Tienda",
    links: [
      { name: "Productos destacados", href: "/productos-destacados" },
      { name: "Preguntas Frecuentes", href: "/preguntas-frecuentes" },
      { name: "Explora", href: "/explora" },
      { name: "Términos y condiciones", href: "/terminos-condiciones" },
      { name: "Políticas de garantía", href: "/politicas-garantia" },
      { name: "Contrato de compraventa", href: "/contrato-compraventa" },
      { name: "Derecho de retracto", href: "/derecho-retracto" },
      { name: "Puntos de venta", href: "/puntos-venta" },
      { name: "Términos de las promociones", href: "/terminos-promociones" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { name: "Contáctanos", href: "/contactanos" },
      { name: "Danos tu opinión", href: "/opinion" },
      {
        name: "Serviciocliente@imagiq.com",
        href: "mailto:serviciocliente@imagiq.com",
      },
    ],
  },
  {
    title: "Destacados e importantes",
    links: [
      { name: "Servicio Técnico", href: "/servicio-tecnico" },
      { name: "Pago seguro", href: "/pago-seguro" },
      { name: "Mi cuenta", href: "/mi-cuenta" },
      { name: "Blog", href: "/blog" },
    ],
  },
];

function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Trigger entrance animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleFooterClick = (section: string, item: string, href: string) => {
    posthogUtils.capture("footer_click", {
      section,
      item,
      href,
      source: "footer",
    });
  };

  return (
    <footer
      className={`bg-white border-t border-gray-200 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
    >
      <div className="container mx-auto px-0 py-0 md:px-6 md:py-12">
        {/* Main footer content */}
        {/* Mobile: dropdown tipo acordeón */}
        <div className="flex flex-col md:hidden">
          {footerSections.map((section) => (
            <div key={section.title} className="border-b border-gray-200">
              <button
                type="button"
                className="w-full flex justify-between items-center py-4 px-4 text-left text-base font-semibold text-gray-900 focus:outline-none"
                onClick={() =>
                  setHoveredSection(
                    hoveredSection === section.title ? null : section.title
                  )
                }
              >
                <span>{section.title}</span>
                <span
                  className={`transition-transform duration-200 ${
                    hoveredSection === section.title ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▾
                </span>
              </button>
              <ul
                className={`overflow-hidden transition-all duration-300 ${
                  hoveredSection === section.title
                    ? "max-h-96 py-2"
                    : "max-h-0 py-0"
                } pl-2`}
              >
                {section.links.map((link) => (
                  <li
                    key={link.name}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <Link
                      href={link.href}
                      className="block text-sm text-gray-600 hover:text-blue-600 font-normal leading-relaxed py-3 px-2 text-left transition-all duration-300"
                      onClick={() =>
                        handleFooterClick(section.title, link.name, link.href)
                      }
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Desktop/tablet: columnas clásicas */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 lg:gap-12 md:divide-y-0">
          {footerSections.map((section, index) => (
            <div
              key={section.title}
              className={`w-full p-4 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
              onMouseEnter={() => setHoveredSection(section.title)}
              onMouseLeave={() => setHoveredSection(null)}
            >
              <h3
                className={`font-semibold text-gray-900 text-base pb-2 border-b border-gray-200 transition-all duration-300 ${
                  hoveredSection === section.title
                    ? "text-blue-600 border-blue-200"
                    : ""
                }`}
              >
                {section.title}
              </h3>
              <ul className="pt-2">
                {section.links.map((link, linkIndex) => (
                  <li
                    key={link.name}
                    className={`transition-all duration-300 ${
                      isVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-2"
                    } border-b border-gray-100 last:border-b-0`}
                    style={{
                      transitionDelay: `${index * 150 + linkIndex * 50}ms`,
                    }}
                  >
                    <Link
                      href={link.href}
                      className="block text-sm text-gray-600 hover:text-blue-600 font-normal leading-relaxed py-3 px-2 text-left transition-all duration-300 relative group rounded-md hover:bg-blue-50"
                      onClick={() =>
                        handleFooterClick(section.title, link.name, link.href)
                      }
                    >
                      <span className="relative z-10 transition-transform duration-200 group-hover:translate-x-1">
                        {link.name}
                      </span>
                      {/* Underline effect with Tailwind */}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent transition-all duration-300 group-hover:w-full"></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div
          className={`mt-12 pt-8 border-t border-gray-200 transition-all duration-500 md:block hidden ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Logo and copyright */}
            <div className="flex flex-col lg:flex-row items-center space-y-2 lg:space-y-0 lg:space-x-6 group">
              <div className="transition-transform duration-300 hover:scale-105 hover:animate-pulse">
                <Logo
                  width={120}
                  height={40}
                  onClick={() => handleFooterClick("bottom", "logo", "/")}
                  className="transition-all duration-300 hover:brightness-110 cursor-pointer"
                />
              </div>
              <p className="text-sm text-gray-500 text-center lg:text-left transition-colors duration-300 group-hover:text-gray-700">
                © 2024 Imagiq Store. Todos los derechos reservados.
              </p>
            </div>

            {/* Legal links */}
            <div className="flex flex-wrap justify-center lg:justify-end items-center space-x-6 text-sm">
              {[
                {
                  name: "Política de Privacidad",
                  href: "/politica-privacidad",
                },
                { name: "Términos de Uso", href: "/terminos-uso" },
                { name: "Política de Cookies", href: "/politica-cookies" },
              ].map((legalLink, index) => (
                <Link
                  key={legalLink.name}
                  href={legalLink.href}
                  className="text-gray-500 hover:text-blue-600 transition-all duration-300 relative group px-2 py-1 rounded-md hover:bg-blue-50"
                  onClick={() =>
                    handleFooterClick("legal", legalLink.name, legalLink.href)
                  }
                  style={{
                    transitionDelay: `${700 + index * 100}ms`,
                  }}
                >
                  <span className="relative z-10">{legalLink.name}</span>
                  {/* Underline effect */}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>
                </Link>
              ))}
            </div>
          </div>

          {/* Additional info */}
          <div
            className={`mt-6 pt-6 border-t border-gray-100 transition-all duration-500 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "800ms" }}
          >
            <div className="text-center">
              <p className="text-xs text-gray-400 leading-relaxed max-w-4xl mx-auto transition-colors duration-300 hover:text-gray-600">
                Imagiq Store es tu tienda de confianza para productos de
                tecnología y electrodomésticos. Ofrecemos garantía oficial,
                servicio técnico especializado y la mejor experiencia de compra
                online. Todos nuestros productos cuentan con garantía del
                fabricante y soporte técnico completo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Also provide named export for flexibility
export { Footer };
