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
  // - Cuando StickyPriceBar NO está visible: debajo del navbar + sticky bar inicial
  // - Cuando StickyPriceBar está visible (scroll): debajo del sticky bar en top-0
  const topClass = isStickyBarVisible
    ? "top-[58px] md:top-[52px] xl:top-[52px]"
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
          {SECTIONS.map((section) => (
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
      {/* Línea indicadora - más pegada al texto */}
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
