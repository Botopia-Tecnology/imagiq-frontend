"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type SectionId = "caracteristicas" | "especificaciones";

interface Section {
  id: SectionId;
  label: string;
  visible: boolean;
  scrollTarget: () => HTMLElement | null;
}

// Offset para compensar: navbar (~55-100px) + MultimediaBottomBar (~46px) + QuickNavBar (~50px) + padding
const SCROLL_OFFSET = 210;

export default function MultimediaQuickNavBar() {
  const [activeSection, setActiveSection] = useState<SectionId>("caracteristicas");
  const [hasCaracteristicas, setHasCaracteristicas] = useState(false);
  const [hasEspecificaciones, setHasEspecificaciones] = useState(false);

  // Ref compartida para cancelar cualquier animación en curso antes de iniciar otra
  const cancelCurrentAnimation = useRef<(() => void) | null>(null);

  // Detectar secciones DENTRO del contenido de Flixmedia en flix-inpage
  useEffect(() => {
    const checkSections = () => {
      const flixContainer = document.querySelector<HTMLElement>('[id^="flix-inpage"]');
      if (!flixContainer) return;

      // Caracteristicas: el contenido principal de Flixmedia existe
      const hasContent = flixContainer.children.length > 0 && flixContainer.innerHTML.length > 100;
      setHasCaracteristicas(hasContent);

      // Especificaciones: buscar la seccion de specs DENTRO de flix-inpage
      const specsElement = flixContainer.querySelector(
        '[flixtemplate-key="specifications"], .inpage_spec-list, .inpage_spec-header'
      );
      setHasEspecificaciones(!!specsElement);
    };

    // Polling porque Flixmedia carga async y puede tardar
    const interval = setInterval(checkSections, 1500);
    checkSections();

    // MutationObserver para detectar mas rapido
    const observer = new MutationObserver(checkSections);
    const flixContainer = document.querySelector<HTMLElement>('[id^="flix-inpage"]');
    if (flixContainer) {
      observer.observe(flixContainer, { childList: true, subtree: true });
    }

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  // Scroll fluido reutilizable: usa rAF para seguir el target en tiempo real,
  // se cancela con scroll manual del usuario o al hacer click en otra sección.
  const smoothScrollTo = useCallback((getTarget: () => HTMLElement | null) => {
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

      const distanceToTarget = el.getBoundingClientRect().top - SCROLL_OFFSET;

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

  const scrollToCaracteristicas = useCallback(() => {
    smoothScrollTo(() => document.querySelector<HTMLElement>('[id^="flix-inpage"]'));
  }, [smoothScrollTo]);

  const scrollToEspecificaciones = useCallback(() => {
    smoothScrollTo(() => {
      const flixContainer = document.querySelector<HTMLElement>('[id^="flix-inpage"]');
      if (!flixContainer) return null;
      return flixContainer.querySelector(
        '[flixtemplate-key="specifications"], .inpage_spec-list, .inpage_spec-header'
      ) as HTMLElement | null;
    });
  }, [smoothScrollTo]);

  // Detectar seccion activa al scrollear
  useEffect(() => {
    if (!hasCaracteristicas) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + SCROLL_OFFSET + 20;

      if (hasEspecificaciones) {
        const flixContainer = document.querySelector<HTMLElement>('[id^="flix-inpage"]');
        if (flixContainer) {
          const specsElement = flixContainer.querySelector(
            '[flixtemplate-key="specifications"], .inpage_spec-list, .inpage_spec-header'
          ) as HTMLElement | null;

          if (specsElement) {
            const specsTop = specsElement.getBoundingClientRect().top + window.scrollY;
            const flixTop = flixContainer.getBoundingClientRect().top + window.scrollY;
            // Solo activar "especificaciones" si specs está razonablemente lejos del inicio
            // del container de Flixmedia. Cuando Flixmedia aún carga imágenes/videos,
            // el specs element aparece muy cerca del top → posición falsa.
            const specsDistanceFromFlixTop = specsTop - flixTop;
            if (specsDistanceFromFlixTop > 300 && scrollPosition >= specsTop) {
              setActiveSection("especificaciones");
              return;
            }
          }
        }
      }

      setActiveSection("caracteristicas");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Delay la primera verificación para dar tiempo a que Flixmedia renderice contenido
    // y las posiciones de los elementos se estabilicen
    const initialCheckTimeout = setTimeout(handleScroll, 500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(initialCheckTimeout);
    };
  }, [hasCaracteristicas, hasEspecificaciones]);

  // No renderizar si Flixmedia no tiene contenido
  if (!hasCaracteristicas) return null;

  const sections: { id: SectionId; label: string; onClick: () => void; show: boolean }[] = [
    { id: "caracteristicas", label: "Caracteristicas", onClick: scrollToCaracteristicas, show: hasCaracteristicas },
    { id: "especificaciones", label: "Especificaciones", onClick: scrollToEspecificaciones, show: hasEspecificaciones },
  ];

  const visibleSections = sections.filter(s => s.show);

  // No mostrar si no hay secciones visibles
  if (visibleSections.length === 0) return null;

  // Position below MultimediaBottomBar (top-[55px] xl:top-[100px], ~46px height)
  const topClass = "top-[100px] md:top-[100px] xl:top-[146px]";

  return (
    <div
      className={`fixed ${topClass} left-0 right-0 z-[1600]
                 bg-white border-b border-gray-100
                 transition-[top] duration-300 ease-out`}
      style={{ fontFamily: "SamsungSharpSans" }}
    >
      <div className="px-4 lg:px-8">
        <div className="flex gap-8 overflow-x-auto scrollbar-hide">
          {visibleSections.map((section) => (
            <button
              key={section.id}
              onClick={section.onClick}
              className="relative py-3 text-lg md:text-xl whitespace-nowrap transition-colors duration-200 font-bold text-gray-900 hover:text-black"
            >
              {section.label}
              <span
                className={`
                  absolute bottom-2 left-0 right-0 h-[2px] bg-black
                  transition-transform duration-200 origin-left
                  ${activeSection === section.id ? "scale-x-100" : "scale-x-0"}
                `}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
