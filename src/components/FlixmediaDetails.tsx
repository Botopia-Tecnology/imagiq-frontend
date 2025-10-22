/**
 * FlixmediaDetails Component
 *
 * Componente que carga el script de Flixmedia y muestra SOLO especificaciones y galería.
 * Basado en FlixmediaPlayer con sistema de fallback inteligente.
 */

"use client";

import { useEffect, useState, useRef } from "react";
import {
  findAvailableSku,
  findAvailableEan,
  parseSkuString,
} from "@/lib/flixmedia";

interface FlixmediaDetailsProps {
  mpn?: string | null;
  ean?: string | null;
  productName?: string;
  className?: string;
}

export default function FlixmediaDetails({
  mpn,
  ean,
  productName = "Producto",
  className = "",
}: FlixmediaDetailsProps) {
  const [actualMpn, setActualMpn] = useState<string | null>(null);
  const [actualEan, setActualEan] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Búsqueda inteligente de SKU disponible (similar a FlixmediaPlayer)
  useEffect(() => {
    async function searchAvailableSku() {
      if (!mpn && !ean) {
        console.warn("⚠️ No se proporcionó MPN/SKU ni EAN");
        return;
      }

      setIsSearching(true);
      console.group(`📋 Flixmedia Details - Búsqueda inteligente de SKU`);
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

      // Si no se encontró ni MPN ni EAN
      if (!foundMpn && !foundEan) {
        console.log(`❌ No hay contenido disponible en Flixmedia`);
      }

      setIsSearching(false);
      console.groupEnd();
    }

    searchAvailableSku();
  }, [mpn, ean, productName]);

  // Cargar el script de Flixmedia cuando tengamos MPN o EAN
  useEffect(() => {
    if (!(actualMpn || actualEan) || scriptLoaded) return;

    console.log("📋 Cargando especificaciones de Flixmedia");

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
    script.setAttribute('data-flix-inpage', 'flix-specifications-inpage');
    script.setAttribute('data-flix-button-image', '');
    script.setAttribute('data-flix-price', '');
    script.setAttribute('data-flix-fallback-language', '');

    script.onload = () => {
      console.log('✅ Script de Flixmedia cargado');
      setScriptLoaded(true);

      // Verificar contenido después de un delay
      setTimeout(() => {
        const inpageContent = document.getElementById('flix-specifications-inpage');
        if (inpageContent && inpageContent.children.length > 0) {
          console.log("✅ Contenido de Flixmedia renderizado:", inpageContent.children.length, "elementos");
          setHasContent(true);
        } else {
          console.warn("⚠️ No se encontró contenido de Flixmedia");
          setHasContent(false);
        }
      }, 3000);
    };

    script.onerror = () => {
      console.error('❌ Error al cargar script de Flixmedia');
      setScriptLoaded(true);
      setHasContent(false);
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
  }, [actualMpn, actualEan, scriptLoaded]);

  // Agregar estilos después de que el script cargue para mostrar solo especificaciones y galería
  useEffect(() => {
    if (!scriptLoaded) return;

    setTimeout(() => {
      const style = document.createElement('style');
      style.id = 'flixmedia-specifications-styles';
      style.textContent = `
        /* Ocultar TODO excepto especificaciones y galería */
        #flix-specifications-inpage [flixtemplate-key="features"],
        #flix-specifications-inpage [flixtemplate-key="background_image"],
        #flix-specifications-inpage [flixtemplate-key="footnotes"] {
          display: none !important;
          visibility: hidden !important;
        }

        /* Mostrar SOLO especificaciones y galería de imágenes */
        #flix-specifications-inpage [flixtemplate-key="specifications"],
        #flix-specifications-inpage [flixtemplate-key="image_gallery"] {
          display: block !important;
          visibility: visible !important;
        }

        /* Estilos para integrar con el diseño existente */
        #flix-specifications-inpage {
          width: 100%;
          background: transparent;
        }

        /* Personalizar especificaciones para que se vean bien */
        #flix-specifications-inpage [flixtemplate-key="specifications"] {
          background-color: transparent !important;
          padding: 0 !important;
        }

        #flix-specifications-inpage [flixtemplate-key="specifications"] h2,
        #flix-specifications-inpage [flixtemplate-key="specifications"] h3 {
          display: none !important;
        }

        #flix-specifications-inpage [flixtemplate-key="specifications"] .inpage_spec-list {
          margin-bottom: 0 !important;
          border: none !important;
          padding: 0 !important;
        }

        /* Personalizar galería de imágenes */
        #flix-specifications-inpage [flixtemplate-key="image_gallery"] {
          background-color: transparent !important;
          padding: 0 !important;
          margin-top: 20px !important;
        }
      `;

      // Remover estilo anterior si existe
      const oldStyle = document.getElementById('flixmedia-specifications-styles');
      if (oldStyle) {
        oldStyle.remove();
      }

      document.head.appendChild(style);
      console.log('✅ Estilos de especificaciones y galería aplicados');

      // Forzar ocultar elementos manualmente con JavaScript
      setTimeout(() => {
        const container = document.getElementById('flix-specifications-inpage');
        if (!container) return;

        // Ocultar todo excepto specifications y image_gallery
        const toHide = ['features', 'background_image', 'footnotes'];
        toHide.forEach(key => {
          const elements = container.querySelectorAll(`[flixtemplate-key="${key}"]`);
          elements.forEach((el) => {
            (el as HTMLElement).style.display = 'none';
            (el as HTMLElement).style.visibility = 'hidden';
          });
        });

        // Asegurarse de que specifications y galería estén visibles
        const toShow = ['specifications', 'image_gallery'];
        let hasVisibleContent = false;
        toShow.forEach(key => {
          const element = container.querySelector(`[flixtemplate-key="${key}"]`);
          if (element) {
            (element as HTMLElement).style.display = 'block';
            (element as HTMLElement).style.visibility = 'visible';
            hasVisibleContent = true;
          }
        });

        if (hasVisibleContent) {
          console.log('✅ Especificaciones y galería visibles');
          setHasContent(true);
        } else {
          console.log('⚠️ No se encontró contenido de especificaciones ni galería');
          setHasContent(false);
        }
      }, 100);
    }, 500);

    return () => {
      const style = document.getElementById('flixmedia-specifications-styles');
      if (style) {
        style.remove();
      }
    };
  }, [scriptLoaded]);

  // No renderizar nada si no hay MPN o EAN
  if (!mpn && !ean) {
    return null;
  }

  // Mostrar loading mientras busca
  if (isSearching) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0099FF] rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Buscando contenido...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`${className} w-full`}>
      {/* Contenedor para las especificaciones y galería de Flixmedia */}
      <div
        id="flix-specifications-inpage"
        className="w-full"
        style={{
          minHeight: hasContent ? 'auto' : '0',
          opacity: hasContent ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />

      {/* Loading indicator */}
      {!scriptLoaded && (actualMpn || actualEan) && (
        <div className="flex items-center justify-center py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0099FF] rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Cargando especificaciones...</p>
          </div>
        </div>
      )}
    </div>
  );
}
