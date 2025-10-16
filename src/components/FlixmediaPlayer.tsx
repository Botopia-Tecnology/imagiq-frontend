/**
 * FlixmediaPlayer Component
 *
 * Componente para cargar contenido multimedia de Flixmedia usando script directo.
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
  parseSkuString,
} from "@/lib/flixmedia";

interface FlixmediaPlayerProps {
  mpn?: string | null;
  ean?: string | null;
  productName?: string;
  className?: string;
  /** Color de fondo personalizado (ej: "bg-blue-50", "bg-gradient-to-br from-gray-50 to-white") */
  backgroundColor?: string;
  /** Padding personalizado alrededor del contenido (ej: "p-4", "px-8 py-4") */
  containerPadding?: string;
}

export default function FlixmediaPlayer({
  mpn,
  ean,
  productName = "Producto",
  className = "",
  backgroundColor = "bg-gradient-to-br from-gray-50 to-white",
  containerPadding = "",
}: FlixmediaPlayerProps) {
  const [actualMpn, setActualMpn] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

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
        console.log(`✅ Usando SKU: ${availableSku}`);
      } else {
        console.log(`❌ No se encontró contenido multimedia`);
      }

      setIsSearching(false);
      console.groupEnd();
    }

    searchAvailableSku();
  }, [mpn, productName]);

  // Función de limpieza según documentación de FlixMedia
  const cleanupFlixMedia = () => {
    const flixResourceDomain = ["flixcar.com", "flixfacts.com", "flix360.com"];

    // Remover todos los scripts de Flix
    const flixScripts = document.getElementsByTagName("script");
    for (let i = flixScripts.length - 1; i >= 0; i--) {
      if (flixResourceDomain.some(domain => flixScripts[i].src.includes(domain))) {
        flixScripts[i].parentNode?.removeChild(flixScripts[i]);
      }
    }

    // Remover todos los links CSS de Flix
    const flixLinks = document.getElementsByTagName("link");
    for (let i = flixLinks.length - 1; i >= 0; i--) {
      if (flixResourceDomain.some(domain => flixLinks[i].href.includes(domain))) {
        flixLinks[i].parentNode?.removeChild(flixLinks[i]);
      }
    }

    // Remover hotspot div
    const hotspotDiv = document.getElementById("flix_hotspots");
    if (hotspotDiv) {
      hotspotDiv.remove();
    }

    // Limpiar contenedor inpage
    const flixInpage = document.getElementById("flix-inpage");
    if (flixInpage) {
      flixInpage.innerHTML = "";
    }

    console.log("🧹 FlixMedia cleanup completado");
  };

  // Cargar el script de Flixmedia cuando tengamos el SKU disponible
  useEffect(() => {
    if (!actualMpn || scriptLoaded) return;

    console.log("🎬 Cargando script de Flixmedia con MPN:", actualMpn);

    // Reset de FlixMedia callbacks según documentación
    if (typeof window !== 'undefined' && (window as any).flixJsCallbacks) {
      if (typeof (window as any).flixJsCallbacks.reset !== 'undefined') {
        (window as any).flixJsCallbacks.reset();
        console.log("🔄 flixJsCallbacks.reset() ejecutado");
      }
    }

    // Limpiar recursos anteriores de FlixMedia
    cleanupFlixMedia();

    // Función para intentar cargar el script
    const attemptToLoadScript = (retryCount = 0, maxRetries = 10) => {
      // Verificar que el contenedor existe
      const container = document.getElementById('flix-inpage');
      if (!container) {
        if (retryCount < maxRetries) {
          console.log(`⏳ Esperando contenedor #flix-inpage... intento ${retryCount + 1}/${maxRetries}`);
          setTimeout(() => attemptToLoadScript(retryCount + 1, maxRetries), 300);
        } else {
          console.error("❌ Contenedor #flix-inpage no encontrado después de múltiples intentos");
        }
        return;
      }

      console.log("📦 Contenedor #flix-inpage encontrado, cargando script...");

      const headID = document.getElementsByTagName("head")[0];
      const flixScript = document.createElement("script");
      flixScript.type = "text/javascript";
      flixScript.src = "//media.flixfacts.com/js/loader.js";
      flixScript.async = true;

      // Configurar atributos según la documentación de Flixmedia
      flixScript.setAttribute("data-flix-distributor", "9329");
      flixScript.setAttribute("data-flix-language", "f5");
      flixScript.setAttribute("data-flix-brand", "Samsung");
      flixScript.setAttribute("data-flix-mpn", actualMpn);
      flixScript.setAttribute("data-flix-ean", ean || "");
      flixScript.setAttribute("data-flix-sku", "");
      flixScript.setAttribute("data-flix-inpage", "flix-inpage");
      flixScript.setAttribute("data-flix-price", "");

      // Agregar al head según documentación
      headID.appendChild(flixScript);

      flixScript.onload = () => {
        console.log("✅ Script de Flixmedia cargado exitosamente");

        // Callback de carga según documentación
        if (typeof (window as any).flixJsCallbacks === "object") {
          (window as any).flixJsCallbacks.setLoadCallback(() => {
            try {
              console.log("✅ Contenido de Flixmedia renderizado completamente");
              setScriptLoaded(true);
            } catch (e) {
              console.error("Error en callback de carga:", e);
            }
          }, 'inpage');
        }

        // Fallback si no hay callbacks
        setTimeout(() => {
          const inpageContent = document.getElementById('flix-inpage');
          if (inpageContent && inpageContent.children.length > 0) {
            console.log("✅ Contenido de Flixmedia renderizado:", inpageContent.children.length, "elementos");
          } else {
            console.warn("⚠️ El script cargó pero no se renderizó contenido. Posibles razones:");
            console.warn("   - Localhost no está autorizado en Flixmedia");
            console.warn("   - El SKU no tiene contenido multimedia disponible");
            console.warn("   - Se requiere configuración adicional del dominio");
          }
          setScriptLoaded(true);
        }, 3000);
      };

      flixScript.onerror = () => {
        console.error("❌ Error al cargar el script de Flixmedia");
        setScriptLoaded(true);
      };
    };

    // Iniciar el intento de carga con delay suficiente para que React renderice el DOM
    setTimeout(() => attemptToLoadScript(), 300);

    return () => {
      // Cleanup al desmontar componente
      cleanupFlixMedia();
    };
  }, [actualMpn, ean, scriptLoaded]);

  // Agregar estilos después de que el script cargue para mostrar solo especificaciones
  useEffect(() => {
    if (!scriptLoaded) return;

    // Esperar un poco para que FlixMedia renderice el contenido
    setTimeout(() => {
      // Primero, verificar qué templates hay en el DOM
      const container = document.getElementById('flix-inpage');
      if (container) {
        console.log('🔍 Investigando estructura del DOM...');
        console.log('Contenedor innerHTML (primeros 500 chars):', container.innerHTML.substring(0, 500));

        const templates = container.querySelectorAll('[flidata-type="template"]');
        console.log('📋 Templates con [flidata-type="template"]:', templates.length);

        // Buscar por flixtemplate-key directamente
        const templatesWithKey = container.querySelectorAll('[flixtemplate-key]');
        console.log('📋 Elementos con [flixtemplate-key]:', templatesWithKey.length);
        templatesWithKey.forEach((template) => {
          const key = template.getAttribute('flixtemplate-key');
          console.log(`  - Template key: ${key}`, template);
        });

        // Buscar todos los elementos con atributos flix*
        const allFlixElements = container.querySelectorAll('[class*="flix"], [id*="flix"]');
        console.log('📋 Elementos con flix en class/id:', allFlixElements.length);

        // Buscar elementos de nivel superior dentro del contenedor
        const topLevelChildren = container.children;
        console.log('📋 Elementos hijos directos de #flix-inpage:', topLevelChildren.length);
        Array.from(topLevelChildren).forEach((child, index) => {
          console.log(`  Hijo ${index}:`, {
            tagName: child.tagName,
            classes: child.className,
            id: child.id,
            attributes: Array.from(child.attributes).map(attr => `${attr.name}="${attr.value}"`).slice(0, 5)
          });
        });
      }

      const style = document.createElement('style');
      style.id = 'flixmedia-custom-styles';
      style.textContent = `
        /*
          Templates de FlixMedia encontrados:
          - background_image: Imágenes de características (features)
          - image_gallery: Galería de imágenes del producto
          - specifications: Especificaciones técnicas
          - footnotes: Notas al pie / disclaimers
        */

        /* ===== PERSONALIZACIÓN DE ESTILOS ===== */

        /* Personalizar títulos de especificaciones */
        #flix-inpage [flixtemplate-key="specifications"] h2,
        #flix-inpage [flixtemplate-key="specifications"] h3,
        #flix-inpage [flixtemplate-key="specifications"] .flix-heading {
          color: #0066CC !important;
          font-weight: bold !important;
        }

        /* Personalizar texto de especificaciones */
        #flix-inpage [flixtemplate-key="specifications"] p,
        #flix-inpage [flixtemplate-key="specifications"] li,
        #flix-inpage [flixtemplate-key="specifications"] span {
          color: #333333 !important;
        }

        /* Personalizar nombres de especificaciones (labels) */
        #flix-inpage [flixtemplate-key="specifications"] .inpage_spec-list strong,
        #flix-inpage [flixtemplate-key="specifications"] .spec-label {
          color: #1a1a1a !important;
          font-weight: 600 !important;
        }

        /* Personalizar valores de especificaciones */
        #flix-inpage [flixtemplate-key="specifications"] .spec-value {
          color: #666666 !important;
        }

        /* Personalizar fondo de la sección de especificaciones */
        #flix-inpage [flixtemplate-key="specifications"] {
          background-color: #ffffff !important;
          padding: 20px !important;
          border-radius: 8px !important;
        }

        /* Opcional: Agregar bordes a cada grupo de especificaciones */
        #flix-inpage [flixtemplate-key="specifications"] .inpage_spec-list {
          border-left: 3px solid #0066CC !important;
          padding-left: 15px !important;
          margin-bottom: 20px !important;
        }
      `;

      // Remover estilo anterior si existe
      const oldStyle = document.getElementById('flixmedia-custom-styles');
      if (oldStyle) {
        oldStyle.remove();
      }

      document.head.appendChild(style);
      console.log('✅ Estilos de FlixMedia aplicados');
    }, 500);

    return () => {
      const style = document.getElementById('flixmedia-custom-styles');
      if (style) {
        style.remove();
      }
    };
  }, [scriptLoaded]);



  // Estado 1: Sin MPN/EAN
  if (!mpn && !ean) {
    return <FlixmediaEmptyState className={className} />;
  }

  // Estado 2: Buscando SKU disponible
  if (isSearching) {
    return <FlixmediaLoadingState className={className} />;
  }

  // Estado 3: No se encontró contenido
  if (!actualMpn) {
    return <FlixmediaNotFoundState className={className} />;
  }

  // Estado 4: Contenido de Flixmedia
  return (
    <div className={`${className} w-full h-full relative min-h-screen ${backgroundColor}`}>
      {/* Contenedor para el botón de Flixmedia minisite */}

      {/* Contenedor para el contenido de Flixmedia */}
      <div
        id="flix-inpage"
        className={`w-full min-h-screen ${containerPadding}`}
        style={{
          minHeight: '100vh',
          width: '100%',
          // Mejoras para reducir pixelación y optimizar renderizado
          imageRendering: 'auto',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
          WebkitFontSmoothing: 'antialiased',
        }}
      />

      {/* Mostrar loading si el script no ha cargado */}
      {!scriptLoaded && (
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
    </div>
  );
}
