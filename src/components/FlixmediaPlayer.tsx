/**
 * FlixmediaPlayer Component
 *
 * Componente para cargar contenido multimedia de Flixmedia usando el script oficial.
 * Implementa sistema de fallback inteligente para múltiples SKUs.
 */

"use client";

import { useEffect, useState, useRef } from "react";
import {
  findAvailableSku,
  findAvailableEan,
  parseSkuString,
} from "@/lib/flixmedia";
import { flixmediaCache } from "@/lib/flixmediaCache";

interface FlixmediaPlayerProps {
  mpn?: string | null;
  ean?: string | null;
  productName?: string;
  className?: string;
  productId?: string;
  segmento?: string | string[]; // Segmento del producto (Premium, etc.) - puede ser string o array
}
import { useRouter } from "next/navigation";

export default function FlixmediaPlayer({
  mpn,
  ean,
  productName = "Producto",
  className = "",
  productId,
  segmento,
}: FlixmediaPlayerProps) {
  const [actualMpn, setActualMpn] = useState<string | null>(null);
  const [actualEan, setActualEan] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    async function searchAvailableSku() {
      const startTime = performance.now();
      console.log('🎬 [PASO 1] FlixmediaPlayer montado - Iniciando búsqueda de SKU/EAN');

      if (!mpn && !ean) {
        console.warn('⚠️ No hay MPN ni EAN para buscar');
        return;
      }

      // 🚀 OPTIMIZACIÓN 1: Verificar cache primero
      const cached = flixmediaCache.get(mpn, ean);
      if (cached) {
        const cacheTime = performance.now();
        console.log(`⚡ [CACHE HIT] Usando resultados cacheados (${(cacheTime - startTime).toFixed(2)}ms)`);
        setActualMpn(cached.mpn);
        setActualEan(cached.ean);

        // Si hay resultados, no redirigir
        if (cached.mpn || cached.ean) {
          return;
        }

        // Si el cache dice que no hay resultados, redirigir
        const isPremiumProduct = (segmento?: string | string[]): boolean => {
          if (!segmento) return false;
          const segmentoValue = Array.isArray(segmento) ? segmento[0] : segmento;
          return segmentoValue?.toLowerCase() === 'premium';
        };

        console.log('❌ [REDIRECT] No hay contenido Flixmedia disponible (cache) - Redirigiendo a vista de producto');
        const isPremium = isPremiumProduct(segmento);
        const route = isPremium
          ? `/productos/viewpremium/${productId}`
          : `/productos/view/${productId}`;
        router.replace(route);
        return;
      }

      let foundMpn: string | null = null;
      let foundEan: string | null = null;

      // Si tenemos MPN, buscamos el SKU disponible
      if (mpn) {
        const mpnStartTime = performance.now();
        const skus = parseSkuString(mpn);
        console.log(`🔍 [PASO 2] Buscando entre ${skus.length} SKUs en paralelo...`);

        if (skus.length > 0) {
          const availableSku = await findAvailableSku(skus);
          const mpnEndTime = performance.now();

          if (availableSku) {
            console.log(`✅ [PASO 2 COMPLETADO] SKU encontrado: ${availableSku} (${(mpnEndTime - mpnStartTime).toFixed(2)}ms)`);
            setActualMpn(availableSku);
            foundMpn = availableSku;
          } else {
            console.log(`❌ [PASO 2] No se encontró SKU disponible (${(mpnEndTime - mpnStartTime).toFixed(2)}ms)`);
          }
        }
      }

      // Si no encontramos MPN o no había MPN, buscamos por EAN
      if (!foundMpn && ean) {
        const eanStartTime = performance.now();
        const eans = parseSkuString(ean);
        console.log(`🔍 [PASO 3] Buscando entre ${eans.length} EANs en paralelo...`);

        if (eans.length > 0) {
          const availableEan = await findAvailableEan(eans);
          const eanEndTime = performance.now();

          if (availableEan) {
            console.log(`✅ [PASO 3 COMPLETADO] EAN encontrado: ${availableEan} (${(eanEndTime - eanStartTime).toFixed(2)}ms)`);
            setActualEan(availableEan);
            foundEan = availableEan;
          } else {
            console.log(`❌ [PASO 3] No se encontró EAN disponible (${(eanEndTime - eanStartTime).toFixed(2)}ms)`);
          }
        }
      }

      const endTime = performance.now();
      console.log(`⏱️ [RESUMEN BÚSQUEDA] Tiempo total de búsqueda: ${(endTime - startTime).toFixed(2)}ms`);

      // 🚀 OPTIMIZACIÓN 2: Guardar resultado en cache
      flixmediaCache.set(mpn, ean, foundMpn, foundEan);

      // Si no se encontró ni MPN ni EAN, redirigir a la vista del producto
      if (!foundMpn && !foundEan) {
        // Función helper para verificar si el producto es premium
        const isPremiumProduct = (segmento?: string | string[]): boolean => {
          if (!segmento) return false;
          const segmentoValue = Array.isArray(segmento) ? segmento[0] : segmento;
          return segmentoValue?.toLowerCase() === 'premium';
        };

        console.log('❌ [REDIRECT] No hay contenido Flixmedia disponible - Redirigiendo a vista de producto');
        const isPremium = isPremiumProduct(segmento);
        const route = isPremium
          ? `/productos/viewpremium/${productId}`
          : `/productos/view/${productId}`;
        router.replace(route);
      }
    }

    searchAvailableSku();
  }, [mpn, ean, productName, productId, segmento, router]);

  useEffect(() => {
    // Cargar el script de Flixmedia solo cuando tengamos MPN o EAN
    if ((actualMpn || actualEan) && !scriptLoaded) {
      const scriptStartTime = performance.now();
      console.log(`🚀 [PASO 4] Agregando script de Flixmedia (MPN: ${actualMpn || 'N/A'}, EAN: ${actualEan || 'N/A'})`);

      // Limpiar scripts anteriores si existen
      const existingScripts = document.querySelectorAll('script[src*="flixfacts.com"]');
      existingScripts.forEach(script => script.remove());

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//media.flixfacts.com/js/loader.js';
      script.async = true;

      // Configurar atributos data según la guía de Flixmedia
      script.setAttribute('data-flix-distributor', '17257');
      script.setAttribute('data-flix-language', 'f5');
      script.setAttribute('data-flix-brand', 'Samsung');
      script.setAttribute('data-flix-mpn', actualMpn || '');
      script.setAttribute('data-flix-ean', actualEan || '');
      script.setAttribute('data-flix-sku', '');
      script.setAttribute('data-flix-inpage', 'flix-inpage');
      script.setAttribute('data-flix-button-image', '');
      script.setAttribute('data-flix-price', '');
      script.setAttribute('data-flix-fallback-language', '');

      script.onload = () => {
        const scriptEndTime = performance.now();
        console.log(`✅ [PASO 5] Script de Flixmedia cargado (${(scriptEndTime - scriptStartTime).toFixed(2)}ms)`);
        console.log('🔄 [PASO 6] Flixmedia procesando contenido...');
        setScriptLoaded(true);

        // 🚀 OPTIMIZACIÓN 3: Usar MutationObserver en lugar de setInterval
        const inpageDiv = document.getElementById('flix-inpage');

        if (inpageDiv) {
          const observer = new MutationObserver(() => {
            const children = inpageDiv.children.length;
            const height = inpageDiv.offsetHeight;
            const hasContent = children > 1 || height > 100;

            if (hasContent) {
              const totalTime = performance.now() - scriptStartTime;
              console.log(`🎉 [PASO 7 COMPLETADO] ¡Contenido Flixmedia visible! Tiempo total: ${totalTime.toFixed(2)}ms`);
              observer.disconnect();
            }
          });

          // Observar cambios en el DOM del contenedor
          observer.observe(inpageDiv, {
            childList: true,
            subtree: true,
            attributes: true,
          });

          // Timeout de seguridad (10 segundos)
          setTimeout(() => {
            observer.disconnect();
            console.warn('⚠️ [TIMEOUT] Límite de 10 segundos alcanzado');
          }, 10000);
        } else {
          console.warn('⚠️ Div #flix-inpage no encontrado');
        }
      };

      script.onerror = () => {
        console.error('❌ [ERROR] No se pudo cargar el script de Flixmedia');
      };

      if (containerRef.current) {
        containerRef.current.appendChild(script);
      } else {
        console.error('❌ [ERROR] containerRef.current no existe');
      }

      // Cleanup al desmontar
      return () => {
        if (containerRef.current && script.parentNode === containerRef.current) {
          containerRef.current.removeChild(script);
        }
      };
    }
  }, [actualMpn, actualEan, scriptLoaded]);

  // Contenedor simple para Flixmedia - Sin skeletons, la página ya tiene uno
  return (
    <div ref={containerRef} className={`${className} w-full px-4 md:px-6 lg:px-8`}>
      <div id="flix-inpage"></div>
    </div>
  );
}
// TypeScript cache clear
