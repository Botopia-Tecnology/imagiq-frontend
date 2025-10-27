/**
 * FlixmediaPlayer Component
 *
 * Componente para cargar contenido multimedia de Flixmedia usando el script oficial.
 * Implementa sistema de fallback inteligente para múltiples SKUs.
 */

"use client";

import { useEffect, useState, useRef } from "react";
import {
  FlixmediaEmptyState,
  FlixmediaLoadingState,
  FlixmediaNotFoundState,
} from "./FlixmediaStates";
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
  const [isSearching, setIsSearching] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [contentFound, setContentFound] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  console.log(actualMpn)
  console.log(actualEan)
  const router = useRouter();
  useEffect(() => {
    async function searchAvailableSku() {
      if (!mpn && !ean) {
        console.warn("⚠️ No se proporcionó MPN/SKU ni EAN");
        return;
      }

      setIsSearching(true);
      console.group(`🎬 Flixmedia - Búsqueda inteligente de SKU`);
      console.log(`📦 Producto: "${productName}"`);
      console.log(`📋 MPN recibido: ${mpn}`);
      console.log(`🏷️ EAN recibido: ${ean}`);

      let foundMpn = false;
      let foundEan = false;

      // Si tenemos MPN, buscamos el SKU disponible
      if (mpn) {
        const skus = parseSkuString(mpn);

        if (skus.length === 0) {
          console.warn("⚠️ No hay SKUs válidos para verificar");
        } else {
          const availableSku = await findAvailableSku(skus);

          if (availableSku) {
            setActualMpn(availableSku);
            foundMpn = true;
            console.log(`✅ Usando MPN: ${availableSku}`);
          } else {
            console.log(`❌ No se encontró contenido multimedia para MPN`);
          }
        }
      }

      // Si no encontramos MPN o no había MPN, buscamos por EAN
      if (!foundMpn && ean) {
        const eans = parseSkuString(ean);

        if (eans.length === 0) {
          console.warn("⚠️ No hay EANs válidos para verificar");
        } else {
          console.log(`🔍 Buscando contenido por EAN...`);
          const availableEan = await findAvailableEan(eans);

          if (availableEan) {
            setActualEan(availableEan);
            foundEan = true;
            console.log(`✅ Usando EAN: ${availableEan}`);
          } else {
            console.log(`❌ No se encontró contenido multimedia para EAN`);
          }
        }
      }

      // Función helper para verificar si el producto es premium
      const isPremiumProduct = (segmento?: string | string[]): boolean => {
        if (!segmento) return false;
        const segmentoValue = Array.isArray(segmento) ? segmento[0] : segmento;
        return segmentoValue?.toLowerCase() === 'premium';
      };

      // Si no se encontró ni MPN ni EAN, ejecutar callback
      if (!foundMpn && !foundEan) {
        console.log(`❌ No hay contenido disponible en Flixmedia`);
        // Determinar la ruta según el segmento del producto
        const isPremium = isPremiumProduct(segmento);
        const route = isPremium 
          ? `/productos/viewpremium/${productId}` 
          : `/productos/view/${productId}`;
        router.replace(route);
        setContentFound(false);
      } else {
        setContentFound(true);
      }

      setIsSearching(false);
      console.groupEnd();
    }

    searchAvailableSku();
  }, [mpn, ean, productName]);

  useEffect(() => {
    // Cargar el script de Flixmedia solo cuando tengamos MPN o EAN
    if ((actualMpn || actualEan) && !scriptLoaded) {
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
        console.log('✅ Script de Flixmedia cargado');
        console.log('📋 Config:', { distributor: '17257', language: 'f5', brand: 'Samsung', mpn: actualMpn, ean: actualEan });
        console.log('🌍 Entorno:', { hostname: window.location.hostname, href: window.location.href });

        // Interceptar errores de scripts
        window.addEventListener('error', (e) => {
          if (e.filename && e.filename.includes('flixcar.com')) {
            console.error('🚨 Error en script de Flixmedia:', e.message, e.filename);
          }
        }, true);

        setScriptLoaded(true);

        // Monitorear cada segundo durante 10 segundos
        let checkCount = 0;
        const checkInterval = setInterval(() => {
          checkCount++;
          const inpageDiv = document.getElementById('flix-inpage');

          if (inpageDiv) {
            const children = inpageDiv.children.length;
            const height = inpageDiv.offsetHeight;

            console.log(`🔍 [${checkCount}/10]`, {
              children,
              height,
              firstTag: inpageDiv.children[0]?.tagName || 'none',
              scriptSrc: inpageDiv.querySelector('script')?.src || 'no script'
            });

            if (children > 1 || height > 100) {
              console.log('✅ Contenido cargado!', { children, height });
              clearInterval(checkInterval);
            }
          }

          if (checkCount >= 10) {
            clearInterval(checkInterval);
            const div = document.getElementById('flix-inpage');
            if (div && (div.children.length <= 1 || div.offsetHeight === 0)) {
              console.error('❌ FALLO: Sin contenido después de 10s');
              console.error('🔍 Debug:', { hostname: window.location.hostname, children: div.children.length, height: div.offsetHeight });
              console.error('📄 HTML:', div.innerHTML.substring(0, 200));
            }
          }
        }, 1000);
      };

      script.onerror = () => {
        console.error('❌ Error al cargar script de Flixmedia');
      };

      console.log('🚀 Agregando script de Flixmedia...', { mpn: actualMpn, ean: actualEan, hasContainer: !!containerRef.current });

      if (containerRef.current) {
        containerRef.current.appendChild(script);
      } else {
        console.error('❌ containerRef.current no existe!');
      }

      // Cleanup al desmontar
      return () => {
        if (containerRef.current && script.parentNode === containerRef.current) {
          containerRef.current.removeChild(script);
        }
      };
    }
  }, [actualMpn, actualEan, scriptLoaded]);


  // Estado 2: Buscando SKU disponible
  if (isSearching) {
    return <FlixmediaLoadingState className={className} />;
  }


  // Estado 4: Contenedor para Flixmedia
  return (
    <div ref={containerRef} className={`${className} w-full px-4 md:px-6 lg:px-8`}>
      <div id="flix-inpage"></div>
    </div>
  );
}
// TypeScript cache clear
