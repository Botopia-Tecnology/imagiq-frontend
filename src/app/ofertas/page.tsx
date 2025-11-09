"use client";
/**
 * Página de Ofertas - Imagiq
 * Muestra cuatro categorías principales con íconos y botón de información
 * El Navbar debe ser transparente y los items en blanco
 */
import Image from "next/image";
import React from "react";

// Opcional: Si el Navbar requiere prop para transparencia, se debe pasar desde layout o contexto

import Link from "next/link";
// Configuración de las categorías y rutas de productos con ofertas
const ofertas = [
  {
    title: "Accesorios",
    icon: "",
    info: "Más información",
    bg: "bg-[#1A407A]",
    href: "/productos/ofertas?seccion=accesorios",
  },
  {
    title: "TV, Monitores y Audio",
    icon: "",
    info: "Más información",
    bg: "bg-[#285CA8]",
    href: "/productos/ofertas?seccion=tv-monitores-audio",
  },
  {
    title: "Smartphones y Tablets",
    icon: "",
    info: "Más información",
    bg: "bg-[#4A7DC3]",
    href: "/productos/ofertas?seccion=smartphones-tablets",
  },
  {
    title: "Electrodomésticos",
    icon: "",
    info: "Más información",
    bg: "bg-[#7CA6D6]",
    whiteIcon: true,
    href: "/productos/ofertas?seccion=electrodomesticos",
  },
];
export default function OfertasPage() {
  // Oculta el scroll y el fondo blanco extra solo en esta página
  // Usar useEffect para manipular el DOM solo cuando el componente está montado
  React.useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    // Guardar estilos originales para restaurar al desmontar
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;
    const originalHtmlHeight = html.style.height;
    const originalBodyHeight = body.style.height;
    const originalBodyBg = body.style.background;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.height = "100vh";
    body.style.height = "100vh";
    body.style.background = "transparent";
    window.scrollTo(0, 0);
    body.scrollTop = 0;
    html.scrollTop = 0;
    return () => {
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
      html.style.height = originalHtmlHeight;
      body.style.height = originalBodyHeight;
      body.style.background = originalBodyBg;
    };
  }, []);
  // Defensive: never return NaN, undefined, or null as children
  const mainContent = (
    <main
      className="w-full h-screen flex flex-col bg-transparent overflow-hidden"
      style={{ height: "100vh", minHeight: "100vh", margin: 0, padding: 0 }}
    >
      {/* Fondo especial solo en móvil: gradiente radial azul con centro blanco muy suave y difuso, igual a la imagen */}
      <div
        className="fixed top-0 left-0 w-full h-full md:hidden z-0"
        style={{
          height: "100vh",
          minHeight: "100vh",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #759dd1 0%, #2b62ac 100%)",
          overflow: "hidden",
        }}
      />
      <div
        className="fixed top-0 left-0 w-full h-full flex flex-col md:flex-row z-0"
        style={{ height: "100vh", minHeight: "100vh", overflow: "hidden" }}
      >
        <div className="flex flex-col justify-center h-full md:hidden">
          <div className="grid grid-cols-1 overflow-y-scroll gap-4 px-2 pt-38">
            {ofertas.map((item) => (
              <div
                key={item.title}
                className="flex-1 flex flex-col items-center justify-center bg-white/10 border border-white/40 rounded-xl shadow-md backdrop-blur-md group transition-all duration-300 cursor-pointer h-full mx-1 px-2 py-2"
                style={{ height: "calc(30vh - 10px)", overflow: "hidden" }}
              >
                <Image
                  src={item.icon}
                  alt={item.title + " icon"}
                  width={88}
                  height={88}
                  className={`mb-2 transition-transform duration-300 group-hover:scale-110${
                    item.whiteIcon ? " filter invert brightness-200" : ""
                  }`}
                  priority
                />
                <h2 className="text-white text-xl font-bold mb-2 text-center transition-colors duration-300 group-hover:text-white/90 px-1">
                  {item.title}
                </h2>
                <Link
                  href={item.href}
                  className="mt-1 px-3 py-0.5 border border-white/80 rounded-full text-white text-xl font-medium text-center hover:bg-white hover:text-[#1A407A] transition-colors duration-200 group-hover:bg-white group-hover:text-[#1A407A]"
                  aria-label={item.info + " " + item.title}
                  scroll={false}
                >
                  {item.info}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Layout desktop/tablet: mantiene el diseño original en fila */}
        {ofertas.map((item) => (
          <div
            key={item.title}
            className={`hidden md:flex flex-1 flex-col items-center justify-center ${item.bg} group transition-all duration-300 cursor-pointer h-full pt-20`}
            style={{ height: "100vh", minHeight: "100vh", overflow: "hidden" }}
          >
            <Image
              src={item.icon}
              alt={item.title + " icon"}
              width={100}
              height={100}
              className={`mb-10 transition-transform duration-300 group-hover:scale-110${
                item.whiteIcon ? " filter invert brightness-200" : ""
              }`}
              priority
            />
            <h2 className="text-white text-2xl md:text-3xl font-bold mb-6 text-center transition-colors duration-300 group-hover:text-white/90">
              {item.title}
            </h2>
            {/* Botón de más información: navega a la categoría de productos con oferta */}
            <Link
              href={item.href}
              className="mt-2 px-6 py-2 border-2 border-white rounded-full text-white text-lg font-medium hover:bg-white hover:text-[#1A407A] transition-colors duration-200 group-hover:bg-white group-hover:text-[#1A407A]"
              aria-label={item.info + " " + item.title}
              scroll={false}
            >
              {item.info}
            </Link>
          </div>
        ))}
      </div>
      {/* El resto del contenido (Navbar y otros) debe tener z-10 o superior para estar sobre el fondo */}
    </main>
  );
  if (
    mainContent == null ||
    (typeof mainContent === "number" && isNaN(mainContent))
  ) {
    return <></>;
  } else {
    return mainContent;
  }
}
