/**
 * FlixmediaPlayer Component
 * 
 * Componente para cargar contenido multimedia de Flixmedia usando iframe.
 * Implementa sistema de fallback inteligente para múltiples SKUs.
 */

"use client";

import { useEffect, useState } from "react";
import {
  FlixmediaEmptyState,
  FlixmediaLoadingState,
  FlixmediaNotFoundState,
} from "./FlixmediaStates";
import {
  findAvailableSku,
  buildFlixmediaUrl,
  parseSkuString,
} from "@/lib/flixmedia";

interface FlixmediaPlayerProps {
  mpn?: string | null;
  ean?: string | null;
  productName?: string;
  className?: string;
}

export default function FlixmediaPlayer({
  mpn,
  ean,
  productName = "Producto",
  className = "",
}: FlixmediaPlayerProps) {
  const [actualMpn, setActualMpn] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState(true);

  useEffect(() => {
    async function searchAvailableSku() {
      if (!mpn) {
        console.warn("⚠️ No se proporcionó MPN/SKU");
        return;
      }

      setIsSearching(true);
      console.group(`🎬 Flixmedia - Búsqueda inteligente de SKU`);
      console.log(`📦 Producto: "${productName}"`);

      const skus = parseSkuString(mpn);
      
      if (skus.length === 0) {
        console.warn("⚠️ No hay SKUs válidos para verificar");
        setIsSearching(false);
        console.groupEnd();
        return;
      }

      const availableSku = await findAvailableSku(skus);

      if (availableSku) {
        setActualMpn(availableSku);
        const url = buildFlixmediaUrl(availableSku);
        setIframeUrl(url);
        console.log(`✅ Usando SKU: ${availableSku}`);
        console.log(`🔗 URL del iframe:`, url);
      } else {
        console.log(`❌ No se encontró contenido multimedia`);
      }

      setIsSearching(false);
      console.groupEnd();
    }

    searchAvailableSku();
  }, [mpn, ean, productName]);

  // Estado 1: Sin MPN/EAN
  if (!mpn && !ean) {
    return <FlixmediaEmptyState className={className} />;
  }

  // Estado 2: Buscando SKU disponible
  if (isSearching) {
    return <FlixmediaLoadingState className={className} />;
  }

  // Estado 3: No se encontró contenido
  if (!actualMpn || !iframeUrl) {
    return <FlixmediaNotFoundState className={className} />;
  }

  // Estado 4: Iframe con contenido
  return (
    <div className={`${className} w-full h-full relative`}>
      {/* Overlay de carga mientras el iframe carga */}
      {iframeLoading && (
        <div className="absolute inset-0 bg-white z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto border-4 border-gray-200 border-t-[#0066CC] rounded-full animate-spin mb-4" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-40 mx-auto animate-pulse" />
              <div className="h-2 bg-gray-200 rounded w-32 mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      )}
      
      <iframe
        src={iframeUrl}
        title={`Multimedia Flixmedia - ${productName}`}
        loading="lazy"
        className="w-full h-screen border-0 m-0 p-0 block"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setIframeLoading(false)}
      />
    </div>
  );
}
// TypeScript cache clear
