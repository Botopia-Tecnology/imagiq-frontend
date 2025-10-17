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
}
import { useRouter } from "next/navigation";

export default function FlixmediaPlayer({
  mpn,
  ean,
  productName = "Producto",
  className = "",
  productId,
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

      // Si no se encontró ni MPN ni EAN, ejecutar callback
      if (!foundMpn && !foundEan) {
        console.log(`❌ No hay contenido disponible en Flixmedia`);
        router.replace(`/productos/view/${productId}`);
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
      script.setAttribute('data-flix-distributor', '9329');
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
        setScriptLoaded(true);
      };

      script.onerror = () => {
        console.error('❌ Error al cargar script de Flixmedia');
      };

      if (containerRef.current) {
        containerRef.current.appendChild(script);
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
    <div ref={containerRef} className={`${className} w-full`}>
      <div id="flix-inpage"></div>
    </div>
  );
}
// TypeScript cache clear
