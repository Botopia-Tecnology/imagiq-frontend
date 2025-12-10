/**
 * FlixmediaPlayer Component - VERSIÓN OPTIMIZADA
 *
 * Mismo sistema de carga que FlixmediaDetails (que funciona en viewpremium)
 * pero mostrando TODO el contenido de Flixmedia.
 */

"use client";

import { useEffect, useState, useRef, memo } from "react";
import { parseSkuString } from "@/lib/flixmedia";

interface FlixmediaPlayerProps {
  mpn?: string | null;
  ean?: string | null;
  productName?: string;
  className?: string;
  productId?: string;
  segmento?: string | string[];
}

function FlixmediaPlayerComponent({
  mpn,
  ean,
  className = "",
}: FlixmediaPlayerProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scriptLoaded) return;

    const loadFlixmedia = async () => {
      const startTime = performance.now();

      // 1. Determinar SKU/EAN a usar
      let targetMpn: string | null = null;
      let targetEan: string | null = null;

      if (mpn) {
        const skus = parseSkuString(mpn);
        if (skus.length > 0) {
          targetMpn = skus[0];
          console.log(`⚡ [FLIXMEDIA] Usando MPN: ${targetMpn}`);
        }
      }

      if (!targetMpn && ean) {
        const eans = parseSkuString(ean);
        if (eans.length > 0) {
          targetEan = eans[0];
          console.log(`⚡ [FLIXMEDIA] Usando EAN: ${targetEan}`);
        }
      }

      if (!targetMpn && !targetEan) {
        console.warn("⚠️ No hay identificadores válidos para Flixmedia");
        return;
      }

      // 2. Limpiar scripts anteriores de Flixmedia (importante!)
      const existingScripts = document.querySelectorAll(
        'script[src*="flixfacts.com"]'
      );
      existingScripts.forEach((script) => script.remove());

      // 3. Crear y cargar nuevo script
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "//media.flixfacts.com/js/loader.js";
      script.async = true;

      // Configurar atributos de Flixmedia
      script.setAttribute("data-flix-distributor", "17257");
      script.setAttribute("data-flix-language", "f5");
      script.setAttribute("data-flix-brand", "Samsung");
      script.setAttribute("data-flix-mpn", targetMpn || "");
      script.setAttribute("data-flix-ean", targetEan || "");
      script.setAttribute("data-flix-sku", "");
      script.setAttribute("data-flix-inpage", "flix-inpage");
      script.setAttribute("data-flix-button-image", "");
      script.setAttribute("data-flix-price", "");
      script.setAttribute("data-flix-fallback-language", "");
      script.setAttribute("data-flix-lazy-load", "false");
      script.setAttribute("data-flix-hotspot", "false");

      script.onload = () => {
        console.log(
          `✅ [FLIXMEDIA] Script cargado en ${(performance.now() - startTime).toFixed(2)}ms`
        );
        setScriptLoaded(true);
      };

      script.onerror = () => {
        console.error("❌ Error al cargar script de Flixmedia");
        setScriptLoaded(true);
      };

      // Agregar el script al contenedor
      if (containerRef.current) {
        containerRef.current.appendChild(script);
      }
    };

    loadFlixmedia();

    return () => {
      // Cleanup al desmontar - no remover scripts globalmente
    };
  }, [mpn, ean, scriptLoaded]);

  // Estilos para ocultar hotspots
  useEffect(() => {
    if (!scriptLoaded) return;

    const style = document.createElement("style");
    style.id = "flixmedia-player-styles";
    style.textContent = `
      [class*="flix_hotspot"],
      [id*="flix_hotspot"],
      div[class*="hotspot"] {
        display: none !important;
        visibility: hidden !important;
      }
      
      #flix-inpage {
        width: 100%;
        min-height: 200px;
      }
    `;

    // Remover estilo anterior si existe
    const oldStyle = document.getElementById("flixmedia-player-styles");
    if (oldStyle) {
      oldStyle.remove();
    }

    document.head.appendChild(style);

    return () => {
      const styleEl = document.getElementById("flixmedia-player-styles");
      if (styleEl) {
        styleEl.remove();
      }
    };
  }, [scriptLoaded]);

  // No renderizar si no hay identificadores
  if (!mpn && !ean) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`${className} w-full min-h-[200px] relative px-4 md:px-6 lg:px-8`}
    >
      <div
        id="flix-inpage"
        className="w-full"
        style={{
          minHeight: "auto",
          opacity: scriptLoaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      />
    </div>
  );
}

// Memoizar para evitar re-renders innecesarios
const FlixmediaPlayer = memo(
  FlixmediaPlayerComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.mpn === nextProps.mpn &&
      prevProps.ean === nextProps.ean &&
      prevProps.productName === nextProps.productName
    );
  }
);

FlixmediaPlayer.displayName = "FlixmediaPlayer";

export default FlixmediaPlayer;
