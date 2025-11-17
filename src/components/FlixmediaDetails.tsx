/**
 * FlixmediaDetails Component
 *
 * Componente que carga el script de Flixmedia y muestra SOLO especificaciones y galería.
 * Basado en FlixmediaPlayer con sistema de fallback inteligente.
 */

"use client";

import { useEffect, useState, useRef, memo } from "react";
import { parseSkuString } from "@/lib/flixmedia";

interface FlixmediaDetailsProps {
  mpn?: string | null;
  ean?: string | null;
  productName?: string;
  className?: string;
}

function FlixmediaDetailsComponent({
  mpn,
  ean,
  productName = "Producto",
  className = "",
}: FlixmediaDetailsProps) {
  const [actualMpn, setActualMpn] = useState<string | null>(null);
  const [actualEan, setActualEan] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Usar directamente los SKUs/EANs sin verificación previa (más rápido y confiable)
  useEffect(() => {
    if (!mpn && !ean) {
      console.warn("⚠️ No se proporcionó MPN/SKU ni EAN");
      return;
    }

    console.group(`📋 Flixmedia Details - Cargando contenido`);
    console.log(`📦 Producto: "${productName}"`);
    console.log(`📋 MPN recibido: ${mpn}`);
    console.log(`🏷️ EAN recibido: ${ean}`);

    // Usar directamente todos los SKUs/EANs sin verificación previa
    // FlixMedia internamente manejará cuál usar
    if (mpn) {
      const skus = parseSkuString(mpn);
      if (skus.length > 0) {
        // Usar el primer SKU (FlixMedia probará todos internamente)
        setActualMpn(skus[0]);
        console.log(`✅ Usando MPN principal: ${skus[0]} (${skus.length} total)`);
      }
    }

    if (ean && !mpn) {
      const eans = parseSkuString(ean);
      if (eans.length > 0) {
        setActualEan(eans[0]);
        console.log(`✅ Usando EAN principal: ${eans[0]} (${eans.length} total)`);
      }
    }

    setIsSearching(false);
    console.groupEnd();
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
    script.setAttribute('data-flix-lazy-load', 'false'); // Desactivar lazy loading para carga inmediata

    script.onload = () => {
      console.log('✅ Script de Flixmedia cargado');

      // Verificar contenido después de un delay
      setTimeout(() => {
        const inpageContent = document.getElementById('flix-specifications-inpage');
        if (inpageContent && inpageContent.children.length > 0) {
          console.log("✅ Contenido de Flixmedia renderizado:", inpageContent.children.length, "elementos");
        } else {
          console.warn("⚠️ No se encontró contenido de Flixmedia en el primer intento");
        }
        setScriptLoaded(true);
      }, 2000);
    };

    script.onerror = () => {
      console.error('❌ Error al cargar script de Flixmedia');
      setScriptLoaded(true);
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
//         #flix-specifications-inpage [flixtemplate-key="background_image"],
    setTimeout(() => {
      const style = document.createElement('style');
      style.id = 'flixmedia-specifications-styles';
      style.textContent = `
        /* Ocultar elementos no deseados */

        #flix-specifications-inpage [flixtemplate-key="footnotes"],
        #flix-specifications-inpage [flixtemplate-key="image_gallery"] {
          display: none !important;
          visibility: hidden !important;
        }

        /* Ocultar todo dentro de features EXCEPTO el selector de características clave */
        #flix-specifications-inpage [flixtemplate-key="features"] > *:not(.inpage_selector_keyfeature) {
          display: none !important;
          visibility: hidden !important;
        }

        /* Mostrar especificaciones y el selector de características clave */
        #flix-specifications-inpage [flixtemplate-key="specifications"],
        #flix-specifications-inpage [flixtemplate-key="features"],
        #flix-specifications-inpage .inpage_selector_keyfeature {
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

        /* Hacer responsive el header de especificaciones */
        #flix-specifications-inpage .inpage_spec-header {
          display: flex !important;
          flex-direction: column !important;
          gap: 12px !important;
          padding: 16px 8px !important;
        }

        @media (min-width: 640px) {
          #flix-specifications-inpage .inpage_spec-header {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 20px 16px !important;
          }
        }

        /* Título responsive */
        #flix-specifications-inpage .inpage_spec-header h2,
        #flix-specifications-inpage .inpage_spec-header .inpage_spec-title {
          font-size: 20px !important;
          line-height: 1.3 !important;
          margin: 0 !important;
          text-align: center !important;
        }

        @media (min-width: 640px) {
          #flix-specifications-inpage .inpage_spec-header h2,
          #flix-specifications-inpage .inpage_spec-header .inpage_spec-title {
            font-size: 24px !important;
            text-align: left !important;
          }
        }

        @media (min-width: 768px) {
          #flix-specifications-inpage .inpage_spec-header h2,
          #flix-specifications-inpage .inpage_spec-header .inpage_spec-title {
            font-size: 28px !important;
          }
        }

        /* Botón Expandir todo responsive */
        #flix-specifications-inpage .inpage_spec-header button,
        #flix-specifications-inpage .inpage_spec-header .inpage_spec-expand-btn {
          font-size: 13px !important;
          padding: 8px 16px !important;
          white-space: nowrap !important;
          width: 100% !important;
          max-width: 200px !important;
          margin: 0 auto !important;
        }

        @media (min-width: 640px) {
          #flix-specifications-inpage .inpage_spec-header button,
          #flix-specifications-inpage .inpage_spec-header .inpage_spec-expand-btn {
            font-size: 14px !important;
            padding: 10px 20px !important;
            width: auto !important;
            margin: 0 !important;
          }
        }

        /* Contenedor de especificaciones responsive */
        #flix-specifications-inpage .inpage_spec-content {
          padding: 8px !important;
          overflow: hidden !important;
        }

        #flix-specifications-inpage .inpage_spec-content table {
          width: 100% !important;
        }

        #flix-specifications-inpage .inpage_spec-list {
          gap: 12px !important;
        }

        #flix-specifications-inpage .inpage_spec-row {
          display: grid !important;
          grid-template-columns: minmax(0, 180px) 1fr !important;
          gap: 8px !important;
          padding: 12px 0 !important;
          border-bottom: 1px solid #f0f2f7 !important;
        }

        #flix-specifications-inpage .inpage_spec-row:last-child {
          border-bottom: none !important;
        }

        #flix-specifications-inpage .inpage_spec-attribute,
        #flix-specifications-inpage .inpage_spec-value {
          font-size: 14px !important;
          line-height: 1.4 !important;
          color: #0a1124 !important;
        }

        #flix-specifications-inpage .inpage_spec-attribute {
          font-weight: 600 !important;
        }

        /* Key features como tarjetas responsivas */
        #flix-specifications-inpage .inpage_selector_keyfeature {
          display: grid !important;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important;
          gap: 12px !important;
          list-style: none !important;
          padding: 0 !important;
          margin: 0 0 24px !important;
        }

        #flix-specifications-inpage .inpage_selector_keyfeature li,
        #flix-specifications-inpage .inpage_selector_keyfeature .inpage_keyfeature-item {
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          gap: 8px !important;
          padding: 16px 12px !important;
          background: #fff !important;
          border-radius: 16px !important;
          border: 1px solid #e2e6f0 !important;
          min-height: 120px !important;
          text-align: center !important;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.07) !important;
        }

        #flix-specifications-inpage .inpage_selector_keyfeature img,
        #flix-specifications-inpage .inpage_selector_keyfeature svg {
          max-width: 48px !important;
          width: 48px !important;
          height: auto !important;
          object-fit: contain !important;
        }

        #flix-specifications-inpage .inpage_selector_keyfeature p,
        #flix-specifications-inpage .inpage_selector_keyfeature span {
          font-size: 13px !important;
          line-height: 1.35 !important;
          color: #0a1124 !important;
        }

        @media (min-width: 640px) {
          #flix-specifications-inpage .inpage_spec-content {
            padding: 16px !important;
          }
        }

        @media (max-width: 768px) {
          #flix-specifications-inpage .inpage_spec-row {
            grid-template-columns: 1fr !important;
            padding: 10px 0 !important;
          }
        }

        @media (max-width: 640px) {
          #flix-specifications-inpage .inpage_selector_keyfeature {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 480px) {
          #flix-specifications-inpage .inpage_selector_keyfeature {
            grid-template-columns: 1fr !important;
          }

          #flix-specifications-inpage .inpage_spec-header h2,
          #flix-specifications-inpage .inpage_spec-header .inpage_spec-title {
            font-size: 18px !important;
          }
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

        // Ocultar elementos no deseados 'background_image',
        const toHide = [ 'footnotes','image_gallery'];
        toHide.forEach(key => {
          const elements = container.querySelectorAll(`[flixtemplate-key="${key}"]`);
          elements.forEach((el) => {
            (el as HTMLElement).style.display = 'none';
            (el as HTMLElement).style.visibility = 'hidden';
          });
        });

        // Ocultar elementos dentro de features EXCEPTO el selector de características clave
        const featuresContainer = container.querySelector(`[flixtemplate-key="features"]`);
        if (featuresContainer) {
          Array.from(featuresContainer.children).forEach((child) => {
            if (!child.classList.contains('inpage_selector_keyfeature')) {
              (child as HTMLElement).style.display = 'none';
              (child as HTMLElement).style.visibility = 'hidden';
            }
          });
        }

        // Asegurarse de que specifications y el selector de características estén visibles
        const toShow = ['specifications', 'features'];
        toShow.forEach(key => {
          const element = container.querySelector(`[flixtemplate-key="${key}"]`);
          if (element) {
            (element as HTMLElement).style.display = 'block';
            (element as HTMLElement).style.visibility = 'visible';
          }
        });

        // Mostrar específicamente el selector de características clave
        const keyFeatureSelector = container.querySelector('.inpage_selector_keyfeature');
        if (keyFeatureSelector) {
          (keyFeatureSelector as HTMLElement).style.display = 'block';
          (keyFeatureSelector as HTMLElement).style.visibility = 'visible';
        }

        console.log('✅ Estilos de especificaciones y galería aplicados');
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
    <div ref={containerRef} className={`${className} w-full min-h-[200px] relative`}>
      {/* Contenedor para las especificaciones y galería de Flixmedia - SIEMPRE VISIBLE */}
      <div
        id="flix-specifications-inpage"
        className="w-full"
        style={{
          minHeight: 'auto',
          opacity: scriptLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-in-out',
        }}
      />

      {/* Loading indicator - Solo visible mientras carga el script */}
      {!scriptLoaded && (actualMpn || actualEan) && (
        <div className="absolute inset-0 flex items-center justify-center py-12 bg-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#0099FF] rounded-full animate-spin" />
            <p className="text-sm text-gray-600 font-medium">Cargando contenido multimedia...</p>
            <p className="text-xs text-gray-400">Espere un momento...</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Exportar componente memoizado para evitar re-renders innecesarios
const FlixmediaDetails = memo(FlixmediaDetailsComponent, (prevProps, nextProps) => {
  // Solo re-renderizar si cambian los SKUs/EANs o el nombre del producto
  return (
    prevProps.mpn === nextProps.mpn &&
    prevProps.ean === nextProps.ean &&
    prevProps.productName === nextProps.productName
  );
});

FlixmediaDetails.displayName = 'FlixmediaDetails';

export default FlixmediaDetails;
