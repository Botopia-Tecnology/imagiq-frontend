"use client";
import React, { useRef, useLayoutEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Apila DOS barras fijas (categorías y header) y reserva espacio arriba
 * para que el contenido no quede tapado. SOLO afecta esta página.
 *
 * Orden: TOP -> categorías | SECOND -> header
 */
type StickyStackProps = {
  /** Barra superior (ej: CategorySlider) */
  topBar: React.ReactNode;
  /** Barra secundaria (debajo) (ej: HeaderSection) */
  secondBar: React.ReactNode;
  /** Contenido que scrollea (sidebar + grid) */
  children: React.ReactNode;
  className?: string;
  /** Alto del header global si también es fixed (si no tienes, deja 0). */
  topOffset?: number;
};

export default function StickyStack({
  topBar,
  secondBar,
  children,
  className,
  topOffset = 0,
}: StickyStackProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  const [topH, setTopH] = useState(0);
  const [secondH, setSecondH] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      setTopH(topRef.current?.offsetHeight ?? 0);
      setSecondH(secondRef.current?.offsetHeight ?? 0);
    };
    measure();

    const ro1 = new ResizeObserver(measure);
    const ro2 = new ResizeObserver(measure);
    if (topRef.current) ro1.observe(topRef.current);
    if (secondRef.current) ro2.observe(secondRef.current);

    window.addEventListener("resize", measure);
    return () => {
      ro1.disconnect();
      ro2.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const topBarTop = topOffset;             // categorías debajo del header global
  const secondBarTop = topOffset + topH;   // header debajo de categorías
  const spacer = topOffset + topH + secondH;

  return (
    <div className={cn("w-full", className)}>
      {/* TOP BAR: Categorías (fijo) */}
      <div
        ref={topRef}
        className={cn("fixed inset-x-0 z-50", "bg-white")}
        style={{ top: topBarTop }}
      >
        {topBar}
      </div>

      {/* SECOND BAR: Header de lista (fijo) */}
      <div
        ref={secondRef}
        className={cn("fixed inset-x-0 z-40", "bg-white", "border-b border-gray-200")}
        style={{ top: secondBarTop }}
      >
        {secondBar}
      </div>

      {/* Espacio para que el contenido no quede tapado */}
      <div style={{ paddingTop: spacer }}>
        {children}
      </div>
    </div>
  );
}
