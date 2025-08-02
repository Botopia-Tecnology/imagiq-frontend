/**
 * Footer del Sitio Web
 * - Links importantes y legales
 * - Información de contacto
 * - Newsletter subscription
 * - Enlaces a redes sociales
 * - Mapa del sitio
 */

"use client";

import Link from "next/link";
import { posthogUtils } from "@/lib/posthogClient";
import Logo from "./Logo";

export const Footer = () => {
  const handleFooterClick = (section: string, item: string) => {
    posthogUtils.capture("footer_click", {
      section,
      item,
      source: "footer",
    });
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción optimizado */}
          <div className="col-span-1">
            <div className="mb-4">
              <Logo
                width={120}
                height={40}
                className="brightness-0 invert"
                onClick={() => handleFooterClick("logo", "footer_logo_click")}
              />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Tu tienda online de confianza. Productos de calidad, precios
              competitivos y el mejor servicio al cliente.
            </p>
            <div className="flex space-x-4">
              <button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => handleFooterClick("social", "facebook")}
              >
                📘
              </button>
              <button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => handleFooterClick("social", "instagram")}
              >
                📷
              </button>
              <button
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => handleFooterClick("social", "twitter")}
              >
                🐦
              </button>
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Productos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/tienda/outlet"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => handleFooterClick("products", "outlet")}
                >
                  Outlet
                </Link>
              </li>
              <li>
                <Link
                  href="/tienda/novedades"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => handleFooterClick("products", "novedades")}
                >
                  Novedades
                </Link>
              </li>
              <li>
                <Link
                  href="/tienda/recomendados"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => handleFooterClick("products", "recomendados")}
                >
                  Recomendados
                </Link>
              </li>
              <li>
                <Link
                  href="/tienda/electrodomesticos"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() =>
                    handleFooterClick("products", "electrodomesticos")
                  }
                >
                  Electrodomésticos
                </Link>
              </li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => handleFooterClick("company", "about")}
                >
                  Acerca de nosotros
                </Link>
              </li>
              <li>
                <Link
                  href="/tiendas"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => handleFooterClick("company", "stores")}
                >
                  Nuestras tiendas
                </Link>
              </li>
              <li>
                <Link
                  href="/ventas-corporativas"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => handleFooterClick("company", "corporate")}
                >
                  Ventas corporativas
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => handleFooterClick("company", "contact")}
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Soporte */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Soporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/soporte"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => handleFooterClick("support", "help")}
                >
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => handleFooterClick("support", "shipping")}
                >
                  Envíos y devoluciones
                </Link>
              </li>
              <li>
                <Link
                  href="/warranty"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => handleFooterClick("support", "warranty")}
                >
                  Garantías
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors"
                  onClick={() => handleFooterClick("support", "faq")}
                >
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              © 2024 Imagiq Store. Todos los derechos reservados.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => handleFooterClick("legal", "privacy")}
              >
                Privacidad
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => handleFooterClick("legal", "terms")}
              >
                Términos
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-white transition-colors"
                onClick={() => handleFooterClick("legal", "cookies")}
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
