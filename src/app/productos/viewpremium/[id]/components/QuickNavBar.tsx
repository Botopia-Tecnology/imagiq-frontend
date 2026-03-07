"use client";

import { useState, useEffect, useCallback } from "react";

interface QuickNavBarProps {
  productName?: string;
  isStickyBarVisible?: boolean; // Indica si el StickyPriceBar está en modo scroll (top-0)
}

type SectionId = "comprar" | "detalles" | "especificaciones";

// Offset para compensar la altura de las barras fijas (StickyPriceBar + QuickNavBar)
const SCROLL_OFFSET = 140;

export default function QuickNavBar({ productName, isStickyBarVisible = false }: QuickNavBarProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("comprar");
  const [hasDetalles, setHasDetalles] = useState(false);
  const [hasEspecificaciones, setHasEspecificaciones] = useState(false);

  // Detectar si Flixmedia renderizó contenido real dentro de detalles-section
  useEffect(() => {
    const checkFlixContent = () => {
      const detallesSection = document.getElementById("detalles-section");
      if (!detallesSection) return;

      // Verificar si hay contenido real de Flixmedia (iframes, imágenes, videos, elementos flix)
      const hasContent = detallesSection.querySelector('iframe') !== null ||
                        detallesSection.querySelectorAll('img').length > 1 ||
                        detallesSection.querySelector('video') !== null ||
                        detallesSection.querySelector('[class*="flix-"]') !== null ||
                        detallesSection.querySelector('[class*="flix_"]') !== null;
      setHasDetalles(hasContent);

      // Buscar specs dentro del contenido renderizado por Flixmedia
      const specsElement = detallesSection.querySelector(
        '[flixtemplate-key="specifications"], .inpage_spec-list, .inpage_spec-header'
      );
      setHasEspecificaciones(!!specsElement);
    };

    // Polling porque Flixmedia carga async
    const interval = setInterval(checkFlixContent, 1500);
    checkFlixContent();

    // MutationObserver para detectar mas rapido
    const observer = new MutationObserver(checkFlixContent);
    const detallesSection = document.getElementById("detalles-section");
    if (detallesSection) {
      observer.observe(detallesSection, { childList: true, subtree: true });
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const scrollToSection = useCallback((elementId: string) => {
    // Para especificaciones, buscar dentro del contenido de Flixmedia
    if (elementId === "especificaciones-flix") {
      const detallesSection = document.getElementById("detalles-section");
      if (!detallesSection) return;

      const specsElement = detallesSection.querySelector(
        '[flixtemplate-key="specifications"], .inpage_spec-list, .inpage_spec-header'
      ) as HTMLElement | null;

      if (specsElement) {
        // Offset mayor para specs porque esta dentro del contenido de Flixmedia
        const top = specsElement.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: "smooth" });
      }
      return;
    }

    const element = document.getElementById(elementId);
    if (element) {
      // Detalles necesita menos offset para que baje un poco mas
      const offset = elementId === "detalles-section" ? 110 : SCROLL_OFFSET;
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  // Detectar seccion activa al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + SCROLL_OFFSET + 100;

      // Verificar especificaciones primero (es la mas abajo)
      if (hasEspecificaciones) {
        const detallesSection = document.getElementById("detalles-section");
        if (detallesSection) {
          const specsElement = detallesSection.querySelector(
            '[flixtemplate-key="specifications"], .inpage_spec-list, .inpage_spec-header'
          ) as HTMLElement | null;

          if (specsElement) {
            const specsTop = specsElement.getBoundingClientRect().top + window.scrollY;
            if (scrollPosition >= specsTop) {
              setActiveSection("especificaciones");
              return;
            }
          }
        }
      }

      // Verificar detalles
      const detallesElement = document.getElementById("detalles-section");
      if (detallesElement && detallesElement.offsetTop <= scrollPosition) {
        setActiveSection("detalles");
        return;
      }

      // Default: comprar
      setActiveSection("comprar");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasEspecificaciones]);

  // Construir secciones visibles - solo mostrar "Detalles" si Flixmedia renderizó contenido
  const sections: { id: SectionId; label: string; elementId: string }[] = [
    { id: "comprar", label: "Comprar", elementId: "comprar-section" },
  ];

  if (hasDetalles) {
    sections.push({ id: "detalles", label: "Detalles", elementId: "detalles-section" });
  }

  if (hasEspecificaciones) {
    sections.push({ id: "especificaciones", label: "Especificaciones", elementId: "especificaciones-flix" });
  }

  // Posicion dinamica:
  const topClass = isStickyBarVisible
    ? "top-[46px] md:top-[52px] xl:top-[52px]"
    : "top-[122px] md:top-[112px] xl:top-[152px]";

  return (
    <div
      className={`fixed ${topClass} left-0 right-0 z-[1600]
                 bg-white/95 backdrop-blur-xl
                 transition-[top] duration-300 ease-out`}
      style={{ fontFamily: "SamsungSharpSans" }}
    >
      <div className="px-4 lg:px-8">
        <div className="flex gap-8 overflow-x-auto scrollbar-hide">
          {sections.map((section) => (
            <NavItem
              key={section.id}
              active={activeSection === section.id}
              onClick={() => scrollToSection(section.elementId)}
            >
              {section.label}
            </NavItem>
          ))}
        </div>
      </div>
    </div>
  );
}

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function NavItem({ active, onClick, children }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className="relative py-3 text-lg md:text-xl whitespace-nowrap transition-colors duration-200 font-bold text-gray-900 hover:text-black"
    >
      {children}
      <span
        className={`
          absolute bottom-2 left-0 right-0 h-[2px] bg-black
          transition-transform duration-200 origin-left
          ${active ? "scale-x-100" : "scale-x-0"}
        `}
      />
    </button>
  );
}
