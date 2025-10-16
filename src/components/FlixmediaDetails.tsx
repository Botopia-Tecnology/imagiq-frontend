/**
 * FlixmediaDetails Component
 *
 * Componente que carga el script de Flixmedia y muestra SOLO la galería de imágenes.
 * Basado en FlixmediaPlayer pero optimizado para mostrar únicamente gallery.
 */

"use client";

import { useEffect, useState, useRef } from "react";

interface FlixmediaDetailsProps {
  mpn?: string | null;
  ean?: string | null;
  className?: string;
}

export default function FlixmediaDetails({
  mpn,
  ean,
  className = "",
}: FlixmediaDetailsProps) {
  console.log('siiiiii')
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
    const flixInpage = document.getElementById("flix-gallery-inpage");
    if (flixInpage) {
      flixInpage.innerHTML = "";
    }

    console.log("🧹 FlixMedia gallery cleanup completado");
  };

  // Cargar el script de Flixmedia
  useEffect(() => {
    if (!mpn) return;

    // Si ya está cargado con el mismo MPN, no hacer nada
    if (loadedMpnRef.current === mpn) {
      console.log("⏭️ MPN ya cargado, saltando:", mpn);
      return;
    }

    console.log("🖼️ Cargando galería de imágenes de Flixmedia con MPN:", mpn);
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
      const container = document.getElementById('flix-gallery-inpage');
      if (!container) {
        console.error("❌ Contenedor #flix-gallery-inpage no encontrado");
        return;
      }

      console.log("📦 Contenedor #flix-gallery-inpage encontrado, cargando script...");

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
      flixScript.setAttribute("data-flix-inpage", "flix-gallery-inpage");
      flixScript.setAttribute("data-flix-price", "");

      // Agregar al head según documentación
      headID.appendChild(flixScript);

      flixScript.onload = () => {
        console.log("✅ Script de Flixmedia para galería cargado");

        // Callback de carga según documentación
        if (typeof (window as any).flixJsCallbacks === "object") {
          (window as any).flixJsCallbacks.setLoadCallback(() => {
            try {
              console.log("✅ Galería de Flixmedia renderizada");
              setScriptLoaded(true);
              setHasContent(true);
            } catch (e) {
              console.error("Error en callback de carga:", e);
            }
          }, 'inpage');
        }

        // Fallback si no hay callbacks
        setTimeout(() => {
          const inpageContent = document.getElementById('flix-gallery-inpage');
          if (inpageContent && inpageContent.children.length > 0) {
            console.log("✅ Galería de Flixmedia renderizada:", inpageContent.children.length, "elementos");
            setHasContent(true);
          } else {
            console.warn("⚠️ No se encontró galería de Flixmedia");
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

  // Agregar estilos después de que el script cargue para mostrar solo galería
  useEffect(() => {
    if (!scriptLoaded) return;

    setTimeout(() => {
      const style = document.createElement('style');
      style.id = 'flixmedia-gallery-styles';
      style.textContent = `
        /* Ocultar TODO excepto galería de imágenes */
        #flix-gallery-inpage [flixtemplate-key="features"],
        #flix-gallery-inpage [flixtemplate-key="background_image"],
        #flix-gallery-inpage [flixtemplate-key="specifications"],
        #flix-gallery-inpage [flixtemplate-key="footnotes"] {
          display: none !important;
          visibility: hidden !important;
        }

        /* Mostrar SOLO galería de imágenes */
        #flix-gallery-inpage [flixtemplate-key="gallery"] {
          display: block !important;
          visibility: visible !important;
        }

        /* Estilos para integrar con el diseño existente */
        #flix-gallery-inpage {
          width: 100%;
          background: transparent;
        }

        /* Personalizar galería para que se vea bien */
        #flix-gallery-inpage [flixtemplate-key="gallery"] {
          background-color: transparent !important;
          padding: 0 !important;
        }

        /* Ocultar títulos de Flixmedia si existen */
        #flix-gallery-inpage [flixtemplate-key="gallery"] h2,
        #flix-gallery-inpage [flixtemplate-key="gallery"] h3 {
          display: none !important;
        }

        /* Asegurar que las imágenes sean responsivas */
        #flix-gallery-inpage [flixtemplate-key="gallery"] img {
          max-width: 100% !important;
          height: auto !important;
        }
      `;

      // Remover estilo anterior si existe
      const oldStyle = document.getElementById('flixmedia-gallery-styles');
      if (oldStyle) {
        oldStyle.remove();
      }

      document.head.appendChild(style);
      console.log('✅ Estilos de galería aplicados');

      // Forzar ocultar elementos manualmente con JavaScript
      setTimeout(() => {
        const container = document.getElementById('flix-gallery-inpage');
        if (!container) return;

        // Ocultar todo excepto gallery
        const toHide = ['features', 'background_image', 'specifications', 'footnotes'];
        toHide.forEach(key => {
          const elements = container.querySelectorAll(`[flixtemplate-key="${key}"]`);
          elements.forEach((el) => {
            (el as HTMLElement).style.display = 'none';
            (el as HTMLElement).style.visibility = 'hidden';
          });
        });

        // Asegurarse de que gallery esté visible
        const gallery = container.querySelector('[flixtemplate-key="gallery"]');
        if (gallery) {
          (gallery as HTMLElement).style.display = 'block';
          (gallery as HTMLElement).style.visibility = 'visible';
          console.log('✅ Galería visible');
          setHasContent(true);
        } else {
          console.log('⚠️ No se encontró template de galería');
          setHasContent(false);
        }
      }, 100);
    }, 500);

    return () => {
      const style = document.getElementById('flixmedia-gallery-styles');
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
      {/* Contenedor para la galería de imágenes de Flixmedia */}
      <div
        id="flix-gallery-inpage"
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
            <p className="text-sm text-gray-500">Cargando galería...</p>
          </div>
        </div>
      )}
    </div>
  );
}
