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

  // Ref para leer isStickyBarVisible en tiempo real dentro de animaciones rAF
  const isStickyRef = useRef(isStickyBarVisible);
  useEffect(() => { isStickyRef.current = isStickyBarVisible; }, [isStickyBarVisible]);

  // Detectar si Flixmedia renderizó contenido real dentro de detalles-section
  useEffect(() => {
    const checkFlixContent = () => {
      const detallesSection = document.getElementById("detalles-section");
      if (!detallesSection) return;

      // Verificar si hay contenido real de Flixmedia
      const flixContainer = detallesSection.querySelector('[id^="flix-inpage"]');
      const hasContent = (flixContainer && flixContainer.children.length > 0) ||
                        detallesSection.querySelector('iframe') !== null ||
                        detallesSection.querySelectorAll('img').length > 1 ||
                        detallesSection.querySelector('video') !== null ||
                        detallesSection.querySelector('[class*="flix-"]') !== null ||
                        detallesSection.querySelector('[class*="flix_"]') !== null ||
                        detallesSection.querySelector('[class*="inpage_"]') !== null;
      setHasDetalles(hasContent);

      // Buscar specs dentro del contenido renderizado por Flixmedia
      const specsElement = detallesSection.querySelector(
        '[flixtemplate-key="specifications"], .inpage_spec-list, .inpage_spec-header'
      );
      setHasEspecificaciones(!!specsElement);
    };

    // Polling rápido porque Flixmedia carga async
    const interval = setInterval(checkFlixContent, 500);
    checkFlixContent();

    // MutationObserver para detectar cambios en el DOM inmediatamente
    const observer = new MutationObserver(checkFlixContent);
    const detallesSection = document.getElementById("detalles-section");
    if (detallesSection) {
      observer.observe(detallesSection, { childList: true, subtree: true });
    } else {
      // Si detalles-section aún no existe, observar el body hasta que aparezca
      const bodyObserver = new MutationObserver(() => {
        const section = document.getElementById("detalles-section");
        if (section) {
          observer.observe(section, { childList: true, subtree: true });
          bodyObserver.disconnect();
          checkFlixContent();
        }
      });
      bodyObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // Scroll fluido con rAF: sigue el target en tiempo real,
  // se cancela con scroll manual del usuario o al hacer click en otra sección.
  const smoothScrollTo = useCallback((getTarget: () => HTMLElement | null, getOffset: () => number) => {
    // Cancelar animación previa si existe
    cancelCurrentAnimation.current?.();

    const target = getTarget();
    if (!target) return;

    let rafId: number;
    let stableFrames = 0;
    let cancelled = false;
    const TOLERANCE = 3;
    const EASE = 0.12;
    const STABLE_NEEDED = 10;
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

      const distanceToTarget = el.getBoundingClientRect().top - getOffset();

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

  // Offset dinámico: cuando el sticky bar está activo los headers son más pequeños
  const getDynamicOffset = useCallback(() => {
    return isStickyRef.current ? 115 : SCROLL_OFFSET;
  }, []);

  const scrollToSection = useCallback((elementId: string) => {
    if (elementId === "comprar-section") {
      smoothScrollTo(() => document.getElementById("comprar-section"), () => SCROLL_OFFSET);
    } else if (elementId === "detalles-section") {
      smoothScrollTo(() => document.getElementById("detalles-section"), getDynamicOffset);
    } else if (elementId === "especificaciones-flix") {
      smoothScrollTo(() => {
        const detallesSection = document.getElementById("detalles-section");
        if (!detallesSection) return null;
        return detallesSection.querySelector(
          '[flixtemplate-key="specifications"], .inpage_spec-list, .inpage_spec-header'
        ) as HTMLElement | null;
      }, getDynamicOffset);
    }
  }, [smoothScrollTo, getDynamicOffset]);

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
    ? "top-[56px] md:top-[58px] xl:top-[52px]"
    : "top-[125px] md:top-[115px] xl:top-[152px]";

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
