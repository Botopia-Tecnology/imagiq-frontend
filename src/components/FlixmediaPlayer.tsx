/**
 * FlixmediaPlayer Component
 *
 * Usa ID único para evitar conflictos con otras instancias
 */

"use client";

import { useEffect, useRef, memo, useCallback, useState } from "react";
import { parseSkuString } from "@/lib/flixmedia";

interface FlixmediaPlayerProps {
  mpn?: string | null;
  ean?: string | null;
  productName?: string;
  className?: string;
  productId?: string;
  segmento?: string | string[];
}

function FlixmediaPlayerComponent({
  mpn,
  ean,
  className = "",
  productId,
}: FlixmediaPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generar un ID único para este contenedor
  const containerId = useRef(`flix-inpage-${productId || Math.random().toString(36).substr(2, 9)}`);

  const applyStyles = useCallback(() => {
    if (document.getElementById("flixmedia-player-styles")) return;

    const style = document.createElement("style");
    style.id = "flixmedia-player-styles";
    style.textContent = `
      [class*="flix_hotspot"], [id*="flix_hotspot"], div[class*="hotspot"] {
        display: none !important;
        visibility: hidden !important;
      }
      [id^="flix-inpage"] { width: 100%; min-height: 200px; }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    let targetMpn: string | null = null;
    let targetEan: string | null = null;

    if (mpn) {
      const skus = parseSkuString(mpn);
      if (skus.length > 0) targetMpn = skus[0];
    }
    if (!targetMpn && ean) {
      const eans = parseSkuString(ean);
      if (eans.length > 0) targetEan = eans[0];
    }

    if (!targetMpn && !targetEan) return;

    console.log('🎬 [FlixmediaPlayer] Loading for:', targetMpn || targetEan, 'Container:', containerId.current);

    // Esperar al siguiente frame
    const frameId = requestAnimationFrame(() => {
      const inpageContainer = document.getElementById(containerId.current);
      if (!inpageContainer) {
        console.error('🎬 [FlixmediaPlayer] Container not found:', containerId.current);
        return;
      }

      // Remover TODOS los scripts de Flixmedia anteriores
      document.querySelectorAll('script[src*="flixfacts.com/js/loader.js"]').forEach(s => s.remove());

      // Crear script
      const headID = document.getElementsByTagName("head")[0];
      const flixScript = document.createElement("script");
      flixScript.type = "text/javascript";
      flixScript.async = true;

      flixScript.setAttribute("data-flix-distributor", "9329");
      flixScript.setAttribute("data-flix-language", "f5");
      flixScript.setAttribute("data-flix-brand", "Samsung");
      flixScript.setAttribute("data-flix-mpn", targetMpn || "");
      flixScript.setAttribute("data-flix-ean", targetEan || "");
      flixScript.setAttribute("data-flix-inpage", containerId.current);
      flixScript.setAttribute("data-flix-button", "");
      flixScript.setAttribute("data-flix-price", "");
      flixScript.setAttribute("data-flix-hotspot", "false");

      flixScript.onload = function () {
        console.log('✅ [FlixmediaPlayer] Script loaded for:', containerId.current);
        setIsLoaded(true);
        applyStyles();

        if (typeof (window as unknown as { flixJsCallbacks?: { setLoadCallback: (fn: () => void, type: string) => void } }).flixJsCallbacks === "object") {
          (window as unknown as { flixJsCallbacks: { setLoadCallback: (fn: () => void, type: string) => void } }).flixJsCallbacks.setLoadCallback(function () {
            console.log('✅ [FlixmediaPlayer] Inpage content loaded for:', containerId.current);
            applyStyles();
          }, "inpage");
        }
      };

      headID.appendChild(flixScript);
      flixScript.src = "//media.flixfacts.com/js/loader.js";
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [mpn, ean, applyStyles]);

  // Reset cuando cambia el producto
  useEffect(() => {
    setIsLoaded(false);
    containerId.current = `flix-inpage-${productId || Math.random().toString(36).substr(2, 9)}`;
  }, [productId]);

  if (!mpn && !ean) return null;

  return (
    <div
      ref={containerRef}
      className={`${className} w-full min-h-[200px] relative px-4 md:px-6 lg:px-8`}
    >
      <div id={containerId.current} className="w-full" />
    </div>
  );
}

const FlixmediaPlayer = memo(FlixmediaPlayerComponent, (prevProps, nextProps) => {
  return prevProps.mpn === nextProps.mpn &&
    prevProps.ean === nextProps.ean &&
    prevProps.productId === nextProps.productId;
});

FlixmediaPlayer.displayName = "FlixmediaPlayer";
export default FlixmediaPlayer;
