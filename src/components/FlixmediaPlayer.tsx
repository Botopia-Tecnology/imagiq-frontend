/**
 * FlixmediaPlayer Component - Versión Simplificada
 * 
 * Carga contenido multimedia de Flixmedia usando IDs únicos por montaje.
 */

"use client";

import { useEffect, memo, useCallback, useId } from "react";
import { parseSkuString } from "@/lib/flixmedia";
import { useRouter } from "next/navigation";

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
  productId,
  segmento
}: FlixmediaPlayerProps) {
  const router = useRouter();
  // useId genera un ID único y estable por instancia del componente
  const reactId = useId();
  const containerId = `flix-inpage${reactId.replace(/:/g, '-')}`;

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
    // Parsear SKUs
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

    console.log(`[FLIXMEDIA] 🎬 Cargando: ${targetMpn || targetEan} → ${containerId}`);

    // Pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`[FLIXMEDIA] ❌ Contenedor ${containerId} no encontrado`);
        return;
      }

      // Limpiar scripts anteriores de Flixmedia
      const oldScripts = document.querySelectorAll('script[data-flix-inpage]');
      oldScripts.forEach(s => s.remove());

      // Configurar callbacks
      if (!window.flixJsCallbacks) {
        (window as typeof window).flixJsCallbacks = {
          setLoadCallback: () => { },
          loadService: () => { }
        };
      }

      window.flixJsCallbacks.setLoadCallback(() => {
        console.log(`[FLIXMEDIA] ✅ Contenido cargado`);
        applyStyles();
      }, "inpage");

      window.flixJsCallbacks.setLoadCallback(() => {
        console.log('[FLIXMEDIA] ❌ Sin contenido, redirigiendo...');
        const isPremium = segmento && (Array.isArray(segmento) ? segmento[0] : segmento)?.toLowerCase() === 'premium';
        router.replace(isPremium ? `/productos/viewpremium/${productId}` : `/productos/view/${productId}`);
      }, 'noshow');

      // Crear y cargar script
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.setAttribute("data-flix-distributor", "17257");
      script.setAttribute("data-flix-language", "f5");
      script.setAttribute("data-flix-brand", "Samsung");
      script.setAttribute("data-flix-mpn", targetMpn || "");
      script.setAttribute("data-flix-ean", targetEan || "");
      script.setAttribute("data-flix-inpage", containerId);
      script.setAttribute("data-flix-button", "");
      script.setAttribute("data-flix-price", "");
      script.setAttribute("data-flix-fallback-language", "es");

      script.onload = () => {
        console.log(`[FLIXMEDIA] ✅ Script cargado`);
        applyStyles();
      };

      script.src = "//media.flixfacts.com/js/loader.js";
      document.head.appendChild(script);
    }, 50);

    return () => {
      clearTimeout(timer);
      // Limpiar script al desmontar
      const scripts = document.querySelectorAll(`script[data-flix-inpage="${containerId}"]`);
      scripts.forEach(s => s.remove());
    };
  }, [mpn, ean, containerId, applyStyles, productId, segmento, router]);

  if (!mpn && !ean) return null;

  return (
    <div className={`${className} w-full min-h-[200px] relative px-4 md:px-6 lg:px-8`}>
      <div id={containerId} className="w-full" />
    </div>
  );
}

const FlixmediaPlayer = memo(FlixmediaPlayerComponent, (prevProps, nextProps) => {
  return prevProps.mpn === nextProps.mpn && prevProps.ean === nextProps.ean;
});

FlixmediaPlayer.displayName = "FlixmediaPlayer";
export default FlixmediaPlayer;
