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

import Script from "next/script";

export default function FlixmediaPlayer({
  mpn,
  ean,
  productName = "Producto",
  className = "",
  productId,
  segmento,
}: FlixmediaPlayerProps) {
  // 1. Determinar SKU/EAN a usar (Directo, sin búsqueda)
  let targetMpn: string | null = null;
  let targetEan: string | null = null;

  if (mpn) {
    const skus = parseSkuString(mpn);
    if (skus.length > 0) {
      targetMpn = skus[0];
    }
  }

  if (!targetMpn && ean) {
    const eans = parseSkuString(ean);
    if (eans.length > 0) {
      targetEan = eans[0];
    }
  }

  if (!targetMpn && !targetEan) {
    return null;
  }

  return (
    <div className={`${className} w-full px-4 md:px-6 lg:px-8 min-h-[400px] relative`}>
      <div id="flix-inpage" style={{ minHeight: '400px' }}></div>

      <Script
        id="flixmedia-loader"
        src="//media.flixfacts.com/js/loader.js"
        strategy="afterInteractive"
        data-flix-distributor="17257"
        data-flix-language="f5"
        data-flix-brand="Samsung"
        data-flix-mpn={targetMpn || ''}
        data-flix-ean={targetEan || ''}
        data-flix-sku=""
        data-flix-inpage="flix-inpage"
        data-flix-button-image=""
        data-flix-price=""
        data-flix-fallback-language=""
        data-flix-hotspot="false"
        onLoad={() => {
          console.log(`✅ [FAST LOAD] Script de Flixmedia cargado`);
          // Inyectar estilos para ocultar hotspots
          const style = document.createElement('style');
          style.id = 'flixmedia-no-hotspot-styles';
          style.textContent = `[class*="flix_hotspot"], [id*="flix_hotspot"], div[class*="hotspot"] { display: none !important; visibility: hidden !important; }`;
          const oldStyle = document.getElementById('flixmedia-no-hotspot-styles');
          if (oldStyle) oldStyle.remove();
          document.head.appendChild(style);
        }}
      />
    </div>
  );
}
// TypeScript cache clear
