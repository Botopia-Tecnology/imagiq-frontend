/**
 * FlixmediaSpecifications Component
 *
 * Componente que carga el script de Flixmedia y muestra SOLO las especificaciones.
 * Basado en FlixmediaPlayer pero optimizado para mostrar únicamente specs.
 */

"use client";

import { useEffect, useState, useRef } from "react";

interface FlixmediaSpecificationsProps {
  mpn?: string | null;
  ean?: string | null;
  className?: string;
}

export default function FlixmediaSpecifications({
  mpn,
  ean,
  className = "",
}: FlixmediaSpecificationsProps) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const loadedMpnRef = useRef<string | null>(null); // Trackear qué MPN ya se cargó

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
    const flixInpage = document.getElementById("flix-specifications-inpage");
    if (flixInpage) {
      flixInpage.innerHTML = "";
    }

    console.log("🧹 FlixMedia specifications cleanup completado");
  };

  // Cargar el script de Flixmedia
  useEffect(() => {
    if (!mpn) return;

    // Si ya está cargado con el mismo MPN, no hacer nada
    if (loadedMpnRef.current === mpn) {
      console.log("⏭️ MPN ya cargado, saltando:", mpn);
      return;
    }

    console.log("📋 Cargando especificaciones de Flixmedia con MPN:", mpn);
    loadedMpnRef.current = mpn;

    // Reset de FlixMedia callbacks según documentación
    if (typeof window !== 'undefined' && (window as any).flixJsCallbacks) {
      if (typeof (window as any).flixJsCallbacks.reset !== 'undefined') {
        (window as any).flixJsCallbacks.reset();
        console.log("🔄 flixJsCallbacks.reset() ejecutado");
      }
    }

    // Limpiar recursos anteriores de FlixMedia solo al inicio
    cleanupFlixMedia();

    // Esperar a que el DOM esté listo antes de cargar el script
    setTimeout(() => {
      // Verificar que el contenedor existe
      const container = document.getElementById('flix-specifications-inpage');
      if (!container) {
        console.error("❌ Contenedor #flix-specifications-inpage no encontrado");
        return;
      }

      console.log("📦 Contenedor #flix-specifications-inpage encontrado, cargando script...");

      const headID = document.getElementsByTagName("head")[0];
      const flixScript = document.createElement("script");
      flixScript.type = "text/javascript";
      flixScript.src = "//media.flixfacts.com/js/loader.js";
      flixScript.async = true;

      // Configurar atributos según la documentación de Flixmedia
      flixScript.setAttribute("data-flix-distributor", "9329");
      flixScript.setAttribute("data-flix-language", "f5");
      flixScript.setAttribute("data-flix-brand", "Samsung");
      flixScript.setAttribute("data-flix-mpn", mpn);
      flixScript.setAttribute("data-flix-ean", ean || "");
      flixScript.setAttribute("data-flix-sku", "");
      flixScript.setAttribute("data-flix-inpage", "flix-specifications-inpage");
      flixScript.setAttribute("data-flix-price", "");

      // Agregar al head según documentación
      headID.appendChild(flixScript);

      flixScript.onload = () => {
        console.log("✅ Script de Flixmedia para especificaciones cargado");

        // Callback de carga según documentación
        if (typeof (window as any).flixJsCallbacks === "object") {
          (window as any).flixJsCallbacks.setLoadCallback(() => {
            try {
              console.log("✅ Especificaciones de Flixmedia renderizadas");
              setScriptLoaded(true);
              setHasContent(true);
            } catch (e) {
              console.error("Error en callback de carga:", e);
            }
          }, 'inpage');
        }

        // Fallback si no hay callbacks
        setTimeout(() => {
          const inpageContent = document.getElementById('flix-specifications-inpage');
          if (inpageContent && inpageContent.children.length > 0) {
            console.log("✅ Especificaciones de Flixmedia renderizadas:", inpageContent.children.length, "elementos");
            setHasContent(true);
          } else {
            console.warn("⚠️ No se encontraron especificaciones de Flixmedia");
            setHasContent(false);
          }
          setScriptLoaded(true);
        }, 3000);
      };

      flixScript.onerror = () => {
        console.error("❌ Error al cargar el script de Flixmedia");
        setScriptLoaded(true);
        setHasContent(false);
      };
    }, 300);

    // Cleanup solo cuando el componente se desmonte o el MPN cambie
    return () => {
      console.log("🗑️ Limpiando FlixMedia del MPN anterior:", loadedMpnRef.current);
      cleanupFlixMedia();
      setScriptLoaded(false);
      setHasContent(false);
      loadedMpnRef.current = null;
    };
  }, [mpn, ean]);

  // Agregar estilos después de que el script cargue para mostrar solo especificaciones
  useEffect(() => {
    if (!scriptLoaded) return;
// #flix-specifications-inpage [flixtemplate-key="image_gallery"],
    setTimeout(() => {
      const style = document.createElement('style');
      style.id = 'flixmedia-specifications-styles';
      style.textContent = `
        /* Ocultar TODO excepto especificaciones */
        #flix-specifications-inpage [flixtemplate-key="features"],
        #flix-specifications-inpage [flixtemplate-key="background_image"],
        
        #flix-specifications-inpage [flixtemplate-key="footnotes"] {
          display: none !important;
          visibility: hidden !important;
        }

        /* Mostrar SOLO especificaciones */
        #flix-specifications-inpage [flixtemplate-key="specifications"] {
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
          display: none !important; /* Ocultar títulos de Flixmedia, usamos los nuestros */
        }

        #flix-specifications-inpage [flixtemplate-key="specifications"] .inpage_spec-list {
          margin-bottom: 0 !important;
          border: none !important;
          padding: 0 !important;
        }

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
      const oldStyle = document.getElementById('flixmedia-specifications-styles');
      if (oldStyle) {
        oldStyle.remove();
      }

      document.head.appendChild(style);
      console.log('✅ Estilos de especificaciones aplicados');

      // Forzar ocultar elementos manualmente con JavaScript
      setTimeout(() => {
        const container = document.getElementById('flix-specifications-inpage');
        if (!container) return;
//'image_gallery',
        // Ocultar todo excepto specifications
        const toHide = ['features', 'background_image',  'footnotes'];
        toHide.forEach(key => {
          const elements = container.querySelectorAll(`[flixtemplate-key="${key}"]`);
          elements.forEach((el) => {
            (el as HTMLElement).style.display = 'none';
            (el as HTMLElement).style.visibility = 'hidden';
          });
        });

        // Asegurarse de que specifications esté visible
        const specifications = container.querySelector('[flixtemplate-key="specifications"]');
        if (specifications) {
          (specifications as HTMLElement).style.display = 'block';
          (specifications as HTMLElement).style.visibility = 'visible';
          console.log('✅ Especificaciones visibles');
          setHasContent(true);
        } else {
          console.log('⚠️ No se encontró template de especificaciones');
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

  // No renderizar nada si no hay MPN
  if (!mpn) {
    return null;
  }

  return (
    <div className={className}>
      {/* Contenedor para las especificaciones de Flixmedia */}
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
      {!scriptLoaded && (
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
