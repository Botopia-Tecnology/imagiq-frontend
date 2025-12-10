/**
 * FlixmediaPlayer Component - VERSIÓN ULTRA-SIMPLE
 * 
 * Este componente inyecta el script de Flixmedia directamente.
 * Sin timeouts, sin spinners, sin lógica compleja.
 */

"use client";

import { useEffect, useRef, useMemo } from "react";
import { parseSkuString } from "@/lib/flixmedia";

interface FlixmediaPlayerProps {
  mpn?: string | null;
  ean?: string | null;
  productName?: string;
  className?: string;
  productId?: string;
  segmento?: string | string[];
}

// Contador global para IDs únicos
let instanceCounter = 0;

export default function FlixmediaPlayer({
  mpn,
  ean,
  className = "",
}: FlixmediaPlayerProps) {
  const instanceId = useMemo(() => ++instanceCounter, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);

  const targetMpn = mpn ? parseSkuString(mpn)[0] || null : null;
  const targetEan = !targetMpn && ean ? parseSkuString(ean)[0] || null : null;

  useEffect(() => {
    if (!targetMpn && !targetEan) return;
    if (hasLoadedRef.current) return;
    if (!containerRef.current) return;

    hasLoadedRef.current = true;
    const containerId = `flix-inpage-${instanceId}`;

    // Crear el script con los atributos de Flixmedia
    const script = document.createElement("script");
    script.src = "//media.flixfacts.com/js/loader.js";
    script.async = true;
    script.setAttribute("data-flix-distributor", "17257");
    script.setAttribute("data-flix-language", "f5");
    script.setAttribute("data-flix-brand", "Samsung");
    script.setAttribute("data-flix-mpn", targetMpn || "");
    script.setAttribute("data-flix-ean", targetEan || "");
    script.setAttribute("data-flix-sku", "");
    script.setAttribute("data-flix-inpage", containerId);
    script.setAttribute("data-flix-button-image", "");
    script.setAttribute("data-flix-price", "");
    script.setAttribute("data-flix-fallback-language", "");
    script.setAttribute("data-flix-hotspot", "false");

    // Agregar al contenedor
    containerRef.current.appendChild(script);

    return () => {
      // Limpieza al desmontar
      hasLoadedRef.current = false;
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [targetMpn, targetEan, instanceId]);

  if (!targetMpn && !targetEan) return null;

  return (
    <div ref={containerRef} className={`${className} w-full px-4 md:px-6 lg:px-8`}>
      <div id={`flix-inpage-${instanceId}`} />
    </div>
  );
}
