"use client";

import { useState, useEffect, useCallback } from "react";

interface QuickNavBarProps {
  productName?: string;
  isStickyBarVisible?: boolean; // Indica si el StickyPriceBar está en modo scroll (top-0)
}

type SectionId = "comprar" | "detalles";

const SECTIONS: { id: SectionId; label: string; elementId: string }[] = [
  { id: "comprar", label: "Comprar", elementId: "comprar-section" },
  { id: "detalles", label: "Detalles", elementId: "detalles-section" },
];

// Offset para compensar la altura de las barras fijas (StickyPriceBar + QuickNavBar)
const SCROLL_OFFSET = 160;

export default function QuickNavBar({ productName, isStickyBarVisible = false }: QuickNavBarProps) {
  const [activeSection, setActiveSection] = useState<SectionId>("comprar");

  const scrollToSection = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const top = element.offsetTop - SCROLL_OFFSET;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  // Detectar sección activa al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + SCROLL_OFFSET + 100; // +100 para mejor UX

      // Encontrar la sección actual basado en la posición del scroll
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const section = SECTIONS[i];
        const element = document.getElementById(section.elementId);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Ejecutar una vez al montar

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Posición dinámica:
  // - Cuando StickyPriceBar NO está visible: debajo del navbar + sticky bar inicial (~110px/128px/150px)
  // - Cuando StickyPriceBar está visible (scroll): debajo del sticky bar en top-0 (~55px)
  const topClass = isStickyBarVisible
    ? "top-[55px] md:top-[55px] xl:top-[60px]"
    : "top-[110px] md:top-[128px] xl:top-[150px]";

  return (
    <div
      className={`fixed ${topClass} left-0 right-0 z-[1600]
                 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm
                 transition-[top] duration-300 ease-out`}
      style={{ fontFamily: "SamsungSharpSans" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {SECTIONS.map((section) => (
            <NavButton
              key={section.id}
              active={activeSection === section.id}
              onClick={() => scrollToSection(section.elementId)}
            >
              {section.label}
            </NavButton>
          ))}
        </div>
      </div>
    </div>
  );
}

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function NavButton({ active, onClick, children }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-1.5 text-sm rounded-full whitespace-nowrap
        transition-all duration-200 font-medium
        ${
          active
            ? "bg-[#0066CC] text-white shadow-sm"
            : "border border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
        }
      `}
    >
      {children}
    </button>
  );
}
