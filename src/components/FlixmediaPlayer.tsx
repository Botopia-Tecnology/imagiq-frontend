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

      let foundMpn = false;
      let foundEan = false;

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
            foundMpn = true;
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
            foundEan = true;
          } else {
            console.log(`❌ [PASO 3] No se encontró EAN disponible (${(eanEndTime - eanStartTime).toFixed(2)}ms)`);
          }
        }
      }

      const endTime = performance.now();
      console.log(`⏱️ [RESUMEN BÚSQUEDA] Tiempo total de búsqueda: ${(endTime - startTime).toFixed(2)}ms`);

      // Función helper para verificar si el producto es premium
      const isPremiumProduct = (segmento?: string | string[]): boolean => {
        if (!segmento) return false;
        const segmentoValue = Array.isArray(segmento) ? segmento[0] : segmento;
        return segmentoValue?.toLowerCase() === 'premium';
      };

      // Si no se encontró ni MPN ni EAN, redirigir a la vista del producto
      if (!foundMpn && !foundEan) {
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
      script.setAttribute('data-flix-hotspot', 'false'); // Desactivar módulo de hotspot

      script.onload = () => {
        const scriptEndTime = performance.now();
        console.log(`✅ [PASO 5] Script de Flixmedia cargado (${(scriptEndTime - scriptStartTime).toFixed(2)}ms)`);
        console.log('🔄 [PASO 6] Flixmedia procesando contenido... (monitoreando cada 500ms)');
        setScriptLoaded(true);

        // Eliminar elementos de hotspot después de que se cargue el script
        setTimeout(() => {
          // Eliminar divs de hotspot
          const hotspotDivs = document.querySelectorAll('[class*="flix_hotspot"]');
          hotspotDivs.forEach((el) => el.remove());

          // Eliminar scripts de hotspot
          const hotspotScripts = document.querySelectorAll('script[src*="hotspot"]');
          hotspotScripts.forEach((el) => el.remove());

          // Agregar estilos para ocultar hotspots
          const style = document.createElement('style');
          style.id = 'flixmedia-no-hotspot-styles';
          style.textContent = `
            [class*="flix_hotspot"],
            [id*="flix_hotspot"],
            div[class*="hotspot"] {
              display: none !important;
              visibility: hidden !important;
            }
          `;

          // Remover estilo anterior si existe
          const oldStyle = document.getElementById('flixmedia-no-hotspot-styles');
          if (oldStyle) {
            oldStyle.remove();
          }

          document.head.appendChild(style);
          console.log('✅ Elementos de hotspot eliminados y ocultados');
        }, 1000);

        // Monitorear cuando el contenido realmente aparece
        let checkCount = 0;
        const contentCheckInterval = setInterval(() => {
          checkCount++;
          const inpageDiv = document.getElementById('flix-inpage');

          if (inpageDiv) {
            const children = inpageDiv.children.length;
            const height = inpageDiv.offsetHeight;
            const hasContent = children > 1 || height > 100;

            console.log(`🔍 [MONITOREO ${checkCount}] Children: ${children}, Height: ${height}px, Contenido visible: ${hasContent ? 'SÍ ✅' : 'NO ⏳'}`);

            if (hasContent) {
              const totalTime = performance.now() - scriptStartTime;
              console.log(`🎉 [PASO 7 COMPLETADO] ¡Contenido Flixmedia visible en pantalla! Tiempo total desde script: ${(totalTime).toFixed(2)}ms`);
              clearInterval(contentCheckInterval);
            }
          } else {
            console.log(`🔍 [MONITOREO ${checkCount}] Div #flix-inpage aún no existe`);
          }

          // Timeout después de 20 intentos (10 segundos)
          if (checkCount >= 20) {
            console.warn('⚠️ [TIMEOUT] Se alcanzó el límite de 10 segundos esperando contenido');
            clearInterval(contentCheckInterval);
          }
        }, 500);
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
