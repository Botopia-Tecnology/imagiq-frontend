/**
 * FlixmediaPlayer Component
 *
 * Usa la API de Match de Flixmedia para verificar contenido ANTES de cargar.
 * Si no hay contenido, redirige inmediatamente sin esperar.
 */

"use client";

import { useEffect, memo, useCallback, useState, useRef } from "react";
import { parseSkuString, checkFlixmediaAvailability, checkFlixmediaAvailabilityByEan, hasPremiumContent as checkPremiumContent } from "@/lib/flixmedia";
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
  const [hasFlixError, setHasFlixError] = useState(false);

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

  const hasPremiumContentCheck = useCallback((): boolean => {
    return checkPremiumContent(apiProductRef.current, productColorsRef.current);
  }, []);

  const redirectToView = useCallback(() => {
    if (preventRedirectRef.current) return;

    const currentSegmento = segmentoRef.current;
    const currentProductId = productIdRef.current;
    const isPremiumSegment = currentSegmento && (Array.isArray(currentSegmento) ? currentSegmento[0] : currentSegmento)?.toUpperCase() === 'PREMIUM';
    const hasPremium = hasPremiumContentCheck();

    const route = (isPremiumSegment || hasPremium)
      ? `/productos/viewpremium/${currentProductId}`
      : `/productos/view/${currentProductId}`;

    router.replace(route);
  }, [router, hasPremiumContentCheck]);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();
    let observer: MutationObserver | null = null;

    // Solo limpiar scripts de ESTE contenedor específico, no de otros componentes
    const cleanupOwnScripts = () => {
      const ownScripts = document.querySelectorAll(`script[data-flix-inpage="${containerId}"]`);
      ownScripts.forEach(s => s.remove());
    };

    cleanupOwnScripts();

    const init = async () => {
      let targetMpn: string | null = null;
      let targetEan: string | null = null;
      let isFallbackMode = false;

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
      if (preventRedirectRef.current) {
        setHasContent(true);
      } else {
        // Modo standalone: Verificar si hay contenido con la API de Match
        // Usa el skuflixmedia DIRECTO del backend (ya viene en formato correcto)
        // Cache in-memory de 5 min (flixmedia.ts)
        try {
          let matched = false;

          if (targetMpn) {
            const result = await checkFlixmediaAvailability(
              targetMpn,
              undefined,
              undefined,
              abortController.signal
            );
            if (!isMounted) return;

            if (result.available) {
              matched = true;
              setHasContent(true);
            }
          } else if (targetEan) {
            const result = await checkFlixmediaAvailabilityByEan(
              targetEan,
              undefined,
              undefined,
              abortController.signal
            );
            if (!isMounted) return;

            if (result.available) {
              matched = true;
              setHasContent(true);
            }
          }

          if (!matched) {
            // Match API respondió: no hay contenido → redirigir inmediatamente
            console.log('[FLIX] Sin contenido para', targetMpn || targetEan, '→ redirigiendo');
            setHasContent(false);
            if (!preventRedirectRef.current) redirectToView();
            return;
          }
        } catch (error) {
          if (abortController.signal.aborted) return;
          if (!isMounted) return;
          // Solo usar fallback si hubo error de red (API caída, timeout, etc.)
          console.log('[FLIX] Error de red en Match API → intentando fallback con loader.js', error);
          isFallbackMode = true;
        }
      }

      // Limpiar scripts propios antes de cargar nuevo
      cleanupOwnScripts();

      if (!isMounted) return;

      const container = document.getElementById(containerId);
      if (!container) return;

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
        const hasPremium = hasPremiumContentCheck();
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

      // Verificar si loader.js renderizó contenido multimedia real (no boilerplate/errores)
      const hasRealContent = (cont: HTMLElement): boolean => {
        if (cont.children.length === 0) return false;
        // Solo contar como contenido real: iframes, múltiples imágenes, o videos
        return cont.querySelector('iframe') !== null ||
               cont.querySelectorAll('img').length > 1 ||
               cont.querySelector('video') !== null;
      };

      // Verificar si hay error de Flixmedia
      const checkForFlixError = () => {
        const cont = document.getElementById(containerId);
        if (!cont) return false;
        const text = cont.textContent?.toLowerCase() || '';
        const hasErrorText = text.includes('producto no encontrado') ||
                            text.includes('no se pudo cargar') ||
                            text.includes('product not found') ||
                            text.includes('no content available');
        const hasBlueBackground = cont.innerHTML.includes('17407A') ||
                                 cont.innerHTML.includes('rgb(23, 64, 122)');
        return hasErrorText || hasBlueBackground;
      };

      let fallbackResolved = false;

      script.onload = () => {
        applyStyles();

        const cont = document.getElementById(containerId);
        if (cont) {
          observer = new MutationObserver(() => {
            if (!isMounted || fallbackResolved) { observer?.disconnect(); return; }

            // Detectar error → redirigir inmediato
            if (checkForFlixError()) {
              console.log('[FLIX] Error de Flixmedia detectado → redirigiendo');
              fallbackResolved = true;
              observer?.disconnect();
              setHasFlixError(true);
              if (!preventRedirectRef.current) redirectToView();
              return;
            }

            // En fallback: detectar contenido real → mostrarlo
            if (isFallbackMode && hasRealContent(cont)) {
              console.log('[FLIX] Fallback exitoso: contenido real detectado');
              fallbackResolved = true;
              observer?.disconnect();
              setHasContent(true);
            }
          });

          observer.observe(cont, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true
          });

          if (isFallbackMode) {
            // Fallback: si en 2s no hay contenido real → redirigir SIEMPRE
            setTimeout(() => {
              if (!isMounted || fallbackResolved) {
                console.log('[FLIX] Fallback timeout: ya resuelto o desmontado', { isMounted, fallbackResolved });
                return;
              }
              console.log('[FLIX] Fallback timeout 2s: sin contenido real → redirigiendo', {
                children: cont.children.length,
                hasIframe: cont.querySelector('iframe') !== null,
                imgCount: cont.querySelectorAll('img').length,
                hasVideo: cont.querySelector('video') !== null,
                innerHTMLLength: cont.innerHTML.length
              });
              fallbackResolved = true;
              observer?.disconnect();
              setHasContent(false);
              if (!preventRedirectRef.current) redirectToView();
            }, 2000);
          } else {
            // Path normal: solo verificar errores
            setTimeout(() => {
              if (!isMounted) return;
              if (checkForFlixError()) {
                observer?.disconnect();
                setHasFlixError(true);
                if (!preventRedirectRef.current) redirectToView();
              }
            }, 2000);
          }
        }
      };

      // Si el script falla al cargar → redirigir
      script.onerror = () => {
        console.log('[FLIX] Error cargando loader.js → redirigiendo');
        if (!isMounted) return;
        setHasContent(false);
        if (!preventRedirectRef.current) redirectToView();
      };

      script.src = "//media.flixfacts.com/js/loader.js";
      document.head.appendChild(script);
    };

    init();

    return () => {
      isMounted = false;
      abortController.abort();
      observer?.disconnect();
      // Solo limpiar scripts de ESTE contenedor específico
      const scripts = document.querySelectorAll(`script[data-flix-inpage="${containerId}"]`);
      scripts.forEach(s => s.remove());
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [mpn, ean, containerId, applyStyles, redirectToView, router, hasPremiumContentCheck]);

  // Sin MPN ni EAN
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

  // Si no hay contenido o hay error de Flixmedia
  if ((hasContent === false || hasFlixError) && preventRedirect) {
    return (
      <div className={`${className} w-full min-h-[200px] flex items-center justify-center bg-gray-50 rounded-lg`}>
        <p className="text-gray-400 text-sm">Contenido multimedia no disponible para este producto</p>
      </div>
    );
  }

  if ((hasContent === false || hasFlixError) && !preventRedirect) {
    return null;
  }

  // Siempre renderizar el container div - oculto cuando aún no hay contenido
  // Esto elimina la necesidad de setTimeout para esperar el render
  return (
    <div className={`${className} w-full min-h-[200px] relative`}>
      <div
        id={containerId}
        className="w-full"
        style={hasContent === false ? { display: 'none' } : undefined}
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
