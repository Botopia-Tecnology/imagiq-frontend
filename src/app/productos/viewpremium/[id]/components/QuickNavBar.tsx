"use client";

import { useState, useEffect, useCallback, useRef } from "react";

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

  // Ref compartida para cancelar cualquier animación en curso antes de iniciar otra
  const cancelCurrentAnimation = useRef<(() => void) | null>(null);

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

  // Scroll fluido con rAF: sigue el target en tiempo real,
  // se cancela con scroll manual del usuario o al hacer click en otra sección.
  const smoothScrollTo = useCallback((getTarget: () => HTMLElement | null, offset: number) => {
    // Cancelar animación previa si existe
    cancelCurrentAnimation.current?.();

    const target = getTarget();
    if (!target) return;

    let rafId: number;
    let stableFrames = 0;
    let cancelled = false;
    const TOLERANCE = 3;
    const EASE = 0.035;
    const STABLE_NEEDED = 20;
    const startTime = Date.now();
    const MAX_DURATION = 4000;

    const cancel = () => {
      if (cancelled) return;
      cancelled = true;
      cancelAnimationFrame(rafId);
      cleanup();
      if (cancelCurrentAnimation.current === cancel) {
        cancelCurrentAnimation.current = null;
      }
    };

    const cleanup = () => {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", onKeyCancel);
    };

    const onKeyCancel = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) cancel();
    };

    window.addEventListener("wheel", cancel, { once: true });
    window.addEventListener("touchstart", cancel, { once: true });
    window.addEventListener("keydown", onKeyCancel);

    // Registrar esta animación como la activa
    cancelCurrentAnimation.current = cancel;

    const animate = () => {
      if (cancelled || Date.now() - startTime > MAX_DURATION) { cleanup(); return; }

      const el = getTarget();
      if (!el) { cleanup(); return; }

      const distanceToTarget = el.getBoundingClientRect().top - offset;

      if (Math.abs(distanceToTarget) < TOLERANCE) {
        stableFrames++;
        if (stableFrames >= STABLE_NEEDED) { cancel(); return; }
      } else {
        stableFrames = 0;
        window.scrollBy(0, distanceToTarget * EASE);
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
  }, []);

  const scrollToSection = useCallback((elementId: string) => {
    if (elementId === "comprar-section") {
      smoothScrollTo(() => document.getElementById("comprar-section"), SCROLL_OFFSET);
    } else if (elementId === "detalles-section") {
      // Detalles: scrollear al inicio del contenido Flixmedia
      smoothScrollTo(() => document.getElementById("detalles-section"), 115);
    } else if (elementId === "especificaciones-flix") {
      // Especificaciones: buscar dentro del contenido Flixmedia
      smoothScrollTo(() => {
        const detallesSection = document.getElementById("detalles-section");
        if (!detallesSection) return null;
        return detallesSection.querySelector(
          '[flixtemplate-key="specifications"], .inpage_spec-list, .inpage_spec-header'
        ) as HTMLElement | null;
      }, 115);
    }
  }, [smoothScrollTo]);

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
