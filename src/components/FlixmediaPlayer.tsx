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
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Lógica unificada de carga ultra-rápida
    // "debe tomar siempre el primero de skuflixmedia y ya con ese lo muestre"

    if (scriptLoaded) return;

    const loadFlixmedia = async () => {
      const startTime = performance.now();

      // 1. Determinar SKU/EAN a usar (Directo, sin búsqueda)
      let targetMpn: string | null = null;
      let targetEan: string | null = null;

      if (mpn) {
        const skus = parseSkuString(mpn);
        if (skus.length > 0) {
          targetMpn = skus[0];
          console.log(`⚡ [FAST LOAD] Usando MPN directo: ${targetMpn}`);
        }
      }

      if (!targetMpn && ean) {
        const eans = parseSkuString(ean);
        if (eans.length > 0) {
          targetEan = eans[0];
          console.log(`⚡ [FAST LOAD] Usando EAN directo: ${targetEan}`);
        }
      }

      if (!targetMpn && !targetEan) {
        console.warn('⚠️ No hay identificadores válidos para Flixmedia');
        return;
      }

      // 2. Cargar Script Inmediatamente
      console.log(`�🔥🔥 [SUPER FAST LOAD] Inyectando script para ${targetMpn || targetEan}`);

      // Limpiar scripts anteriores
      const existingScripts = document.querySelectorAll('script[src*="flixfacts.com"]');
      existingScripts.forEach(script => script.remove());

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//media.flixfacts.com/js/loader.js';
      script.async = true;

      // Configurar atributos
      script.setAttribute('data-flix-distributor', '17257');
      script.setAttribute('data-flix-language', 'f5');
      script.setAttribute('data-flix-brand', 'Samsung');
      script.setAttribute('data-flix-mpn', targetMpn || '');
      script.setAttribute('data-flix-ean', targetEan || '');
      script.setAttribute('data-flix-sku', '');
      script.setAttribute('data-flix-inpage', 'flix-inpage');
      script.setAttribute('data-flix-button-image', '');
      script.setAttribute('data-flix-price', '');
      script.setAttribute('data-flix-fallback-language', '');
      script.setAttribute('data-flix-hotspot', 'false');

      script.onload = () => {
        console.log(`✅ [FAST LOAD] Script cargado en ${(performance.now() - startTime).toFixed(2)}ms`);
        setScriptLoaded(true);

        // Limpieza de hotspots (mantenida por consistencia visual)
        setTimeout(() => {
          const style = document.createElement('style');
          style.id = 'flixmedia-no-hotspot-styles';
          style.textContent = `[class*="flix_hotspot"], [id*="flix_hotspot"], div[class*="hotspot"] { display: none !important; visibility: hidden !important; }`;
          const oldStyle = document.getElementById('flixmedia-no-hotspot-styles');
          if (oldStyle) oldStyle.remove();
          document.head.appendChild(style);
        }, 500);
      };

      if (containerRef.current) {
        containerRef.current.appendChild(script);
      }
    };

    loadFlixmedia();

    return () => {
      // Cleanup básico
      const scripts = document.querySelectorAll('script[src*="flixfacts.com"]');
      // No removemos el script al desmontar para evitar parpadeos si se navega rápido, 
      // pero si se requiere limpieza estricta, descomentar:
      // scripts.forEach(s => s.remove());
    };
  }, [mpn, ean, scriptLoaded]);

  // Contenedor simple para Flixmedia - Sin skeletons, la página ya tiene uno
  return (
    <div ref={containerRef} className={`${className} w-full px-4 md:px-6 lg:px-8`}>
      <div id="flix-inpage"></div>
    </div>
  );
}
// TypeScript cache clear
