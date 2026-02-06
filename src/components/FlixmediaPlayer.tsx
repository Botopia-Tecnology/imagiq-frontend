/**
 * FlixmediaPlayer Component
 * 
 * Usa la API de Match de Flixmedia para verificar contenido ANTES de cargar.
 * Si no hay contenido, redirige inmediatamente sin esperar.
 */

"use client";

import { useEffect, memo, useCallback, useState, useRef } from "react";
import { parseSkuString, generateMpnVariants } from "@/lib/flixmedia";
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
  // Cuando es true, no redirige si no hay contenido (para uso embebido)
  preventRedirect?: boolean;
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

/**
 * Hook personalizado para precargar Flixmedia temprano
 */
function useFlixmediaPreload() {
  useEffect(() => {
    // Precargar recursos de Flixmedia apenas se monte el componente
    if (typeof window === 'undefined') return;

    // DNS prefetch
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = '//media.flixfacts.com';
    if (!document.querySelector('link[href="//media.flixfacts.com"]')) {
      document.head.appendChild(dnsPrefetch);
    }

    // Preconnect
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://media.flixfacts.com';
    preconnect.crossOrigin = 'anonymous';
    if (!document.querySelector('link[href="https://media.flixfacts.com"]')) {
      document.head.appendChild(preconnect);
    }

    // Preload del script
    const preload = document.createElement('link');
    preload.rel = 'preload';
    preload.as = 'script';
    preload.href = '//media.flixfacts.com/js/loader.js';
    if (!document.querySelector('link[href="//media.flixfacts.com/js/loader.js"]')) {
      document.head.appendChild(preload);
    }
  }, []);
}

function FlixmediaPlayerComponent({
  mpn,
  ean,
  className = "",
  productId,
  segmento,
  preventRedirect = false,
  apiProduct,
  productColors
}: FlixmediaPlayerProps) {
  const router = useRouter();
  const [containerId] = useState(() => `flix-inpage-${Date.now()}`);
  const [hasContent, setHasContent] = useState<boolean | null>(null);
  // Estado para ocultar si Flixmedia muestra error después de cargar
  const [hasFlixError, setHasFlixError] = useState(false);

  // Precargar recursos de Flixmedia temprano
  useFlixmediaPreload();

  // Refs para mantener valores actuales (evitar stale closures)
  const segmentoRef = useRef(segmento);
  const productIdRef = useRef(productId);
  const apiProductRef = useRef(apiProduct);
  const productColorsRef = useRef(productColors);
  const preventRedirectRef = useRef(preventRedirect);

  // Actualizar refs cuando cambien las props
  useEffect(() => {
    segmentoRef.current = segmento;
    productIdRef.current = productId;
    apiProductRef.current = apiProduct;
    productColorsRef.current = productColors;
    preventRedirectRef.current = preventRedirect;
  }, [segmento, productId, apiProduct, productColors, preventRedirect]);

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

      /* Ocultar errores de Flixmedia con fondo azul */
      [style*="background-color: rgb(23, 64, 122)"],
      [style*="background-color:#17407A"],
      [style*="background-color: #17407A"],
      [style*="background:#17407A"],
      [style*="background: #17407A"],
      div[style*="17407A"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
      }
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
    // Si preventRedirect está activo, no redirigir
    if (preventRedirectRef.current) {
      return;
    }

    // Verificar segmento premium (usando ref para valor actual)
    const currentSegmento = segmentoRef.current;
    const currentProductId = productIdRef.current;
    const isPremiumSegment = currentSegmento && (Array.isArray(currentSegmento) ? currentSegmento[0] : currentSegmento)?.toUpperCase() === 'PREMIUM';

    // Verificar contenido premium
    const hasPremium = hasPremiumContent();

    // Usar viewpremium si tiene segmento premium O contenido premium
    const route = (isPremiumSegment || hasPremium)
      ? `/productos/viewpremium/${currentProductId}`
      : `/productos/view/${currentProductId}`;

    router.replace(route);
  }, [router, hasPremiumContent]); // Sin dependencias de props directas

  useEffect(() => {
    let isMounted = true;

    // Solo limpiar scripts de ESTE contenedor específico, no de otros componentes
    const cleanupOwnScripts = () => {
      const ownScripts = document.querySelectorAll(`script[data-flix-inpage="${containerId}"]`);
      ownScripts.forEach(s => s.remove());
    };

    // Limpiar solo scripts propios al inicio
    cleanupOwnScripts();

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
        if (!preventRedirectRef.current) {
          redirectToView();
        } else {
          setHasContent(false);
        }
        return;
      }

      // Modo embebido (preventRedirect=true): cargar directamente sin verificar match API
      // Esto es más confiable porque el loader de Flixmedia es más flexible que la API de match
      if (preventRedirectRef.current) {
        setHasContent(true);

        // Esperar un momento para que React renderice el contenedor
        await new Promise(resolve => setTimeout(resolve, 50));

        const container = document.getElementById(containerId);
        if (!container) {
          console.error(`[FLIXMEDIA] ❌ Contenedor ${containerId} no encontrado`);
          return;
        }

        // Limpiar solo scripts de ESTE contenedor, no todos
        const oldScripts = document.querySelectorAll(`script[data-flix-inpage="${containerId}"]`);
        oldScripts.forEach(s => s.remove());
      } else {
        // Modo standalone: Verificar si hay contenido con la API de Match
        // Probar múltiples variantes del MPN (con/sin guiones, barras, etc.)
        try {
          let matchedMpn: string | null = null;
          let matchData: { event?: string } | null = null;

          if (targetMpn) {
            const mpnVariants = generateMpnVariants(targetMpn);

            for (const variant of mpnVariants) {
              const matchUrl = `https://media.flixcar.com/delivery/webcall/match/${DISTRIBUTOR_ID}/${LANGUAGE}/mpn/${encodeURIComponent(variant)}`;

              try {
                const response = await fetch(matchUrl);
                if (!isMounted) return;

                if (response.ok) {
                  const data = await response.json();
                  if (data.event === 'matchhit') {
                    matchedMpn = variant;
                    matchData = data;
                    break;
                  }
                }
              } catch {
                // Continuar con la siguiente variante
              }
            }
          } else if (targetEan) {
            // Probar con EAN
            const matchUrl = `https://media.flixcar.com/delivery/webcall/match/${DISTRIBUTOR_ID}/${LANGUAGE}/ean/${encodeURIComponent(targetEan)}`;
            const response = await fetch(matchUrl);
            if (!isMounted) return;

            if (response.ok) {
              const data = await response.json();
              if (data.event === 'matchhit') {
                matchData = data;
              }
            }
          }

          // Si no encontramos contenido con ninguna variante
          if (!matchData || matchData.event !== 'matchhit') {
            setHasContent(false);
            redirectToView();
            return;
          }

          // Usar el MPN que funcionó
          if (matchedMpn) {
            targetMpn = matchedMpn;
          }

          setHasContent(true);

          // Esperar un momento para que React renderice el contenedor
          await new Promise(resolve => setTimeout(resolve, 10));

          const container = document.getElementById(containerId);
          if (!container) {
            console.error(`[FLIXMEDIA] ❌ Contenedor ${containerId} no encontrado`);
            return;
          }

          // Limpiar scripts anteriores
          const oldScripts = document.querySelectorAll('script[data-flix-inpage]');
          oldScripts.forEach(s => s.remove());
        } catch (error) {
          console.error('[FLIXMEDIA PLAYER] Error verificando contenido:', error);
          if (isMounted) {
            setHasContent(false);
            redirectToView();
          }
          return;
        }
      }

      // Continuar con la carga del script (común para ambos modos)
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`[FLIXMEDIA] ❌ Contenedor ${containerId} no encontrado`);
        return;
      }

      // Configurar callbacks ANTES de cargar el script
      if (!window.flixJsCallbacks) {
        window.flixJsCallbacks = {
          setLoadCallback: () => { },
          loadService: () => { }
        };
      }

      // Agregar función flixCartClick
      (window as typeof window & { flixJsCallbacks: { flixCartClick?: () => void } }).flixJsCallbacks.flixCartClick = () => {
        const currentSegmento = segmentoRef.current;
        const currentProductId = productIdRef.current;
        const isPremiumSegment = currentSegmento && (Array.isArray(currentSegmento) ? currentSegmento[0] : currentSegmento)?.toUpperCase() === 'PREMIUM';
        const hasPremium = hasPremiumContent();
        const route = (isPremiumSegment || hasPremium)
          ? `/productos/viewpremium/${currentProductId}`
          : `/productos/view/${currentProductId}`;
        router.push(route);
      };

      // Configurar callback de renderizado
      window.flixJsCallbacks.setLoadCallback(() => {
        applyStyles();
      }, "inpage");

      // Crear script siguiendo el método del PDF (Sección 1b - Alternative Implementation)
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

      // Función para verificar si hay error de Flixmedia
      const checkForFlixError = () => {
        const cont = document.getElementById(containerId);
        if (!cont) return false;

        // Verificar texto de error
        const text = cont.textContent?.toLowerCase() || '';
        const hasErrorText = text.includes('producto no encontrado') ||
                            text.includes('no se pudo cargar') ||
                            text.includes('product not found') ||
                            text.includes('no content available');

        // Verificar fondo azul característico de Flixmedia error (#17407A)
        const hasBlueBackground = cont.innerHTML.includes('17407A') ||
                                 cont.innerHTML.includes('rgb(23, 64, 122)');

        return hasErrorText || hasBlueBackground;
      };

      script.onload = () => {
        applyStyles();

        // MutationObserver para detectar errores inyectados por Flixmedia
        const cont = document.getElementById(containerId);
        if (cont) {
          const observer = new MutationObserver(() => {
            if (checkForFlixError()) {
              observer.disconnect();
              setHasFlixError(true);
              if (!preventRedirectRef.current) {
                redirectToView();
              }
            }
          });

          observer.observe(cont, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true
          });

          // También verificar después de un tiempo por si acaso
          setTimeout(() => {
            if (checkForFlixError()) {
              observer.disconnect();
              setHasFlixError(true);
              if (!preventRedirectRef.current) {
                redirectToView();
              }
            }
          }, 2000);
        }
      };

      script.src = "//media.flixfacts.com/js/loader.js";
      document.head.appendChild(script);
    };

    init();

    return () => {
      isMounted = false;
      // Solo limpiar scripts de ESTE contenedor específico
      const scripts = document.querySelectorAll(`script[data-flix-inpage="${containerId}"]`);
      scripts.forEach(s => s.remove());
      // Limpiar el contenedor
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }
      // NO limpiar estado global para no interferir con otros componentes Flixmedia
    };
  }, [mpn, ean, containerId, applyStyles, redirectToView, router, hasPremiumContent]);

  if (!mpn && !ean) {
    if (preventRedirect) {
      return (
        <div className={`${className} w-full min-h-[200px] flex items-center justify-center bg-gray-50 rounded-lg`}>
          <p className="text-gray-400 text-sm">Contenido multimedia no disponible para este producto</p>
        </div>
      );
    }
    return null;
  }

  // Mientras verifica, mostrar div vacío (sin skeleton para cargar más rápido)
  if (hasContent === null) {
    return (
      <div className={`${className} w-full min-h-[200px] relative`} />
    );
  }

  // Si no hay contenido o hay error de Flixmedia
  if (hasContent === false || hasFlixError) {
    // Si preventRedirect está activo, mostrar placeholder
    if (preventRedirect) {
      return (
        <div className={`${className} w-full min-h-[200px] flex items-center justify-center bg-gray-50 rounded-lg`}>
          <p className="text-gray-400 text-sm">Contenido multimedia no disponible para este producto</p>
        </div>
      );
    }
    // Si no, no renderizar nada (ya está redirigiendo)
    return null;
  }

  return (
    <div className={`${className} w-full min-h-[200px] relative`}>
      <div
        id={containerId}
        className="w-full"
      />
    </div>
  );
}

const FlixmediaPlayer = memo(FlixmediaPlayerComponent, (prevProps, nextProps) => {
  return prevProps.mpn === nextProps.mpn &&
         prevProps.ean === nextProps.ean &&
         prevProps.preventRedirect === nextProps.preventRedirect;
});

FlixmediaPlayer.displayName = "FlixmediaPlayer";
export default FlixmediaPlayer;
