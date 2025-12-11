/**
 * FlixmediaPlayer Component
 * 
 * Usa la API de Match de Flixmedia para verificar contenido ANTES de cargar.
 * Si no hay contenido, redirige inmediatamente sin esperar.
 */

"use client";

import { useEffect, memo, useCallback, useState, useRef } from "react";
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
  // Información del producto para verificar contenido premium
  apiProduct?: {
    imagenPremium?: string[][];
    videoPremium?: string[][];
    imagen_premium?: string[][];
    video_premium?: string[][];
  };
  productColors?: Array<{
    imagen_premium?: string[];
    video_premium?: string[];
  }>;
}

const DISTRIBUTOR_ID = "17257";
const LANGUAGE = "f5";

function FlixmediaPlayerComponent({
  mpn,
  ean,
  className = "",
  productId,
  segmento,
  apiProduct,
  productColors
}: FlixmediaPlayerProps) {
  const router = useRouter();
  const [containerId] = useState(() => `flix-inpage-${Date.now()}`);
  const [hasContent, setHasContent] = useState<boolean | null>(null);

  // Refs para mantener valores actuales (evitar stale closures)
  const segmentoRef = useRef(segmento);
  const productIdRef = useRef(productId);
  const apiProductRef = useRef(apiProduct);
  const productColorsRef = useRef(productColors);

  // Actualizar refs cuando cambien las props
  useEffect(() => {
    segmentoRef.current = segmento;
    productIdRef.current = productId;
    apiProductRef.current = apiProduct;
    productColorsRef.current = productColors;
  }, [segmento, productId, apiProduct, productColors]);

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

  // Función helper para verificar si el producto tiene contenido premium (usa refs)
  const hasPremiumContent = useCallback((): boolean => {
    const currentApiProduct = apiProductRef.current;
    const currentProductColors = productColorsRef.current;

    // Verificar en apiProduct (imagenPremium/videoPremium o sus alias)
    const checkArrayOfArrays = (arr?: string[][]): boolean => {
      if (!arr || !Array.isArray(arr)) return false;
      return arr.some((innerArray: string[]) => {
        if (!Array.isArray(innerArray) || innerArray.length === 0) return false;
        return innerArray.some(item => item && typeof item === 'string' && item.trim() !== '');
      });
    };

    const hasApiPremiumContent =
      checkArrayOfArrays(currentApiProduct?.imagenPremium) ||
      checkArrayOfArrays(currentApiProduct?.videoPremium) ||
      checkArrayOfArrays(currentApiProduct?.imagen_premium) ||
      checkArrayOfArrays(currentApiProduct?.video_premium);

    // Verificar en los colores del producto (imagen_premium/video_premium)
    const hasColorPremiumContent = currentProductColors?.some(color => {
      const hasColorImages = color.imagen_premium && Array.isArray(color.imagen_premium) &&
        color.imagen_premium.length > 0 &&
        color.imagen_premium.some(img => img && typeof img === 'string' && img.trim() !== '');
      const hasColorVideos = color.video_premium && Array.isArray(color.video_premium) &&
        color.video_premium.length > 0 &&
        color.video_premium.some(vid => vid && typeof vid === 'string' && vid.trim() !== '');
      return hasColorImages || hasColorVideos;
    }) || false;

    return hasApiPremiumContent || hasColorPremiumContent;
  }, []); // Sin dependencias porque usa refs

  const redirectToView = useCallback(() => {
    // Verificar segmento premium (usando ref para valor actual)
    const currentSegmento = segmentoRef.current;
    const currentProductId = productIdRef.current;
    const isPremiumSegment = currentSegmento && (Array.isArray(currentSegmento) ? currentSegmento[0] : currentSegmento)?.toUpperCase() === 'PREMIUM';

    // Verificar contenido premium
    const hasPremium = hasPremiumContent();

    // Solo usar viewpremium si tiene segmento premium Y contenido premium
    const route = (isPremiumSegment && hasPremium)
      ? `/productos/viewpremium/${currentProductId}`
      : `/productos/view/${currentProductId}`;

    console.log(`[FLIXMEDIA] ➡️ Redirigiendo a: ${route} (segmento: ${isPremiumSegment}, contenido: ${hasPremium})`);
    router.replace(route);
  }, [router, hasPremiumContent]); // Sin dependencias de props directas

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
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
        redirectToView();
        return;
      }

      console.log(`[FLIXMEDIA] 🔍 Verificando contenido para: ${targetMpn || targetEan}`);

      // 1. PRIMERO: Verificar si hay contenido con la API de Match
      try {
        const matchUrl = targetMpn
          ? `https://media.flixcar.com/delivery/webcall/match/${DISTRIBUTOR_ID}/${LANGUAGE}/mpn/${encodeURIComponent(targetMpn)}`
          : `https://media.flixcar.com/delivery/webcall/match/${DISTRIBUTOR_ID}/${LANGUAGE}/ean/${encodeURIComponent(targetEan!)}`;

        const response = await fetch(matchUrl);

        if (!isMounted) return;

        if (!response.ok) {
          // 404 = no hay contenido
          console.log('[FLIXMEDIA] ❌ No hay contenido (matchmiss)');
          setHasContent(false);
          redirectToView();
          return;
        }

        const data = await response.json();

        if (data.event === 'matchmiss') {
          console.log('[FLIXMEDIA] ❌ No hay contenido (matchmiss)');
          setHasContent(false);
          redirectToView();
          return;
        }

        console.log('[FLIXMEDIA] ✅ Contenido disponible (matchhit)');
        setHasContent(true);

        // 2. DESPUÉS: Cargar el player solo si hay contenido
        const container = document.getElementById(containerId);
        if (!container) {
          console.error(`[FLIXMEDIA] ❌ Contenedor ${containerId} no encontrado`);
          return;
        }

        // Limpiar scripts anteriores
        const oldScripts = document.querySelectorAll('script[data-flix-inpage]');
        oldScripts.forEach(s => s.remove());

        // Configurar callbacks
        if (!window.flixJsCallbacks) {
          window.flixJsCallbacks = {
            setLoadCallback: () => { },
            loadService: () => { }
          };
        }

        // Agregar función flixCartClick que Flixmedia espera para el botón "Comprar"
        (window as typeof window & { flixJsCallbacks: { flixCartClick?: () => void } }).flixJsCallbacks.flixCartClick = () => {
          console.log('[FLIXMEDIA] 🛒 Cart click - Redirigiendo a página de producto');
          // Usar refs para obtener valores actuales
          const currentSegmento = segmentoRef.current;
          const currentProductId = productIdRef.current;
          // Verificar segmento premium
          const isPremiumSegment = currentSegmento && (Array.isArray(currentSegmento) ? currentSegmento[0] : currentSegmento)?.toUpperCase() === 'PREMIUM';
          // Verificar contenido premium
          const hasPremium = hasPremiumContent();
          // Solo usar viewpremium si tiene segmento premium Y contenido premium
          const route = (isPremiumSegment && hasPremium)
            ? `/productos/viewpremium/${currentProductId}`
            : `/productos/view/${currentProductId}`;
          console.log(`[FLIXMEDIA] ➡️ Redirigiendo a: ${route} (segmento: ${isPremiumSegment}, contenido: ${hasPremium})`);
          router.push(route);
        };

        window.flixJsCallbacks.setLoadCallback(() => {
          console.log('[FLIXMEDIA] ✅ Contenido renderizado');
          applyStyles();
        }, "inpage");

        // Crear script
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.setAttribute("data-flix-distributor", DISTRIBUTOR_ID);
        script.setAttribute("data-flix-language", LANGUAGE);
        script.setAttribute("data-flix-brand", "Samsung");
        script.setAttribute("data-flix-mpn", targetMpn || "");
        script.setAttribute("data-flix-ean", targetEan || "");
        script.setAttribute("data-flix-inpage", containerId);
        script.setAttribute("data-flix-button", "");
        script.setAttribute("data-flix-price", "");

        script.onload = () => {
          console.log('[FLIXMEDIA] ✅ Script cargado');
          applyStyles();
        };

        script.src = "//media.flixfacts.com/js/loader.js";
        document.head.appendChild(script);

      } catch (error) {
        console.error('[FLIXMEDIA] Error verificando contenido:', error);
        if (isMounted) {
          setHasContent(false);
          redirectToView();
        }
      }
    };

    init();

    return () => {
      isMounted = false;
      const scripts = document.querySelectorAll(`script[data-flix-inpage="${containerId}"]`);
      scripts.forEach(s => s.remove());
    };
  }, [mpn, ean, containerId, applyStyles, redirectToView]);

  if (!mpn && !ean) return null;

  // Mientras verifica, no mostrar nada (muy rápido)
  if (hasContent === null) {
    return (
      <div className={`${className} w-full min-h-[200px] relative px-4 md:px-6 lg:px-8`}>
        <div id={containerId} className="w-full" />
      </div>
    );
  }

  // Si no hay contenido, no renderizar nada (ya está redirigiendo)
  if (hasContent === false) {
    return null;
  }

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
