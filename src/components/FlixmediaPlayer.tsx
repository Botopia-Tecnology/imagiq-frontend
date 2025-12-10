/**
 * FlixmediaPlayer Component
 * 
 * Carga contenido multimedia de Flixmedia.
 * Usa IDs dinámicos para evitar conflictos en el DOM durante navegación SPA.
 */

"use client";

import { useEffect, useRef, memo, useCallback, useState } from "react";
import { parseSkuString } from "@/lib/flixmedia";

declare global {
  interface Window {
    flixJsCallbacks?: {
      setLoadCallback: (fn: () => void, type?: string) => void;
      loadService: (type: string) => void;
    };
  }
}

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
  productId
}: FlixmediaPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Generar ID único para este montaje del componente
  const [uniqueId] = useState(() => `flix-inpage-${Math.random().toString(36).substr(2, 9)}`);
  const currentMpnRef = useRef<string | null>(null);

  const applyStyles = useCallback(() => {
    if (document.getElementById("flixmedia-player-styles")) return;

    const style = document.createElement("style");
    style.id = "flixmedia-player-styles";
    style.textContent = `
      [class*="flix_hotspot"], [id*="flix_hotspot"], div[class*="hotspot"] {
        display: none !important;
        visibility: hidden !important;
      }
      [id^="flix-inpage-"] { width: 100%; min-height: 200px; }
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

    if (!targetMpn && !targetEan) {
      console.warn('[FLIXMEDIA] ⚠️ No MPN o EAN disponible');
      return;
    }

    const productKey = targetMpn || targetEan || '';

    // Si ya estamos procesando este producto en este contenedor específico, salir
    if (currentMpnRef.current === productKey) {
      return;
    }

    currentMpnRef.current = productKey;
    console.log(`[FLIXMEDIA] 🎬 Iniciando para: ${productKey} en contenedor: ${uniqueId}`);

    // Función para verificar si el contenedor está listo
    const waitForContainer = (): Promise<HTMLElement> => {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50; // 5 segundos

        const checkContainer = () => {
          attempts++;
          const container = document.getElementById(uniqueId);

          if (container) {
            console.log(`[FLIXMEDIA] ✅ Contenedor ${uniqueId} listo (intento ${attempts})`);
            resolve(container);
          } else if (attempts >= maxAttempts) {
            console.error(`[FLIXMEDIA] ❌ Timeout esperando contenedor ${uniqueId}`);
            reject(new Error('Container timeout'));
          } else {
            setTimeout(checkContainer, 100);
          }
        };

        checkContainer();
      });
    };

    // Función para cargar el script de Flixmedia
    const loadFlixmediaScript = (container: HTMLElement) => {
      // Limpiar contenedor
      container.innerHTML = "";

      // Limpiar scripts anteriores que apunten a este contenedor específico
      // O scripts genéricos antiguos si es necesario, pero mejor ser específico
      const oldScripts = document.querySelectorAll(`script[data-flix-inpage="${uniqueId}"]`);
      oldScripts.forEach(s => s.remove());

      console.log(`[FLIXMEDIA] 📦 Creando script para ${uniqueId}`);

      const headID = document.getElementsByTagName("head")[0];
      const flixScript = document.createElement("script");
      flixScript.type = "text/javascript";
      flixScript.async = true;

      flixScript.setAttribute("data-flix-distributor", "9329");
      flixScript.setAttribute("data-flix-language", "f5");
      flixScript.setAttribute("data-flix-brand", "Samsung");
      flixScript.setAttribute("data-flix-mpn", targetMpn || "");
      flixScript.setAttribute("data-flix-ean", targetEan || "");
      // IMPORTANTE: Usar el ID único del contenedor
      flixScript.setAttribute("data-flix-inpage", uniqueId);
      flixScript.setAttribute("data-flix-button", "");
      flixScript.setAttribute("data-flix-price", "");
      flixScript.setAttribute("data-flix-hotspot", "false");

      const startTime = performance.now();

      flixScript.onload = function () {
        const loadTime = (performance.now() - startTime).toFixed(2);
        console.log(`[FLIXMEDIA] ✅ Script cargado en ${loadTime}ms para ${uniqueId}`);

        applyStyles();

        if (typeof window.flixJsCallbacks === "object") {
          window.flixJsCallbacks.setLoadCallback(function () {
            console.log(`[FLIXMEDIA] ✅✅✅ Contenido renderizado en ${uniqueId}`);
            applyStyles();
          }, "inpage");
        }
      };

      flixScript.onerror = function (e) {
        console.error('[FLIXMEDIA] ❌ Error cargando script:', e);
      };

      headID.appendChild(flixScript);
      flixScript.src = "//media.flixfacts.com/js/loader.js";
    };

    // Iniciar el proceso
    waitForContainer()
      .then(loadFlixmediaScript)
      .catch(err => console.error('[FLIXMEDIA] Error:', err));

    return () => {
      // Cleanup: remover el script asociado a este contenedor cuando se desmonte
      const scripts = document.querySelectorAll(`script[data-flix-inpage="${uniqueId}"]`);
      scripts.forEach(s => s.remove());
      currentMpnRef.current = null;
    };
  }, [mpn, ean, applyStyles, uniqueId]);

  if (!mpn && !ean) return null;

  return (
    <div
      ref={containerRef}
      className={`${className} w-full min-h-[200px] relative px-4 md:px-6 lg:px-8`}
    >
      <div id={uniqueId} className="w-full" />
    </div>
  );
}

const FlixmediaPlayer = memo(FlixmediaPlayerComponent, (prevProps, nextProps) => {
  return prevProps.mpn === nextProps.mpn && prevProps.ean === nextProps.ean;
});

FlixmediaPlayer.displayName = "FlixmediaPlayer";
export default FlixmediaPlayer;
