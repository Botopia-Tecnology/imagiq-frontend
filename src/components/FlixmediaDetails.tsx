/**
 * FlixmediaDetails Component
 *
 * Usa requestAnimationFrame para asegurar que el DIV esté en el DOM
 * antes de inyectar el script de Flixmedia.
 */

"use client";

import { useEffect, useRef, memo, useCallback } from "react";
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
  className = "",
}: FlixmediaDetailsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const applyStyles = useCallback(() => {
    if (document.getElementById('flixmedia-specifications-styles')) return;

    const style = document.createElement('style');
    style.id = 'flixmedia-specifications-styles';
    style.textContent = `
      #flix-specifications-inpage [flixtemplate-key="footnotes"],
      #flix-specifications-inpage [flixtemplate-key="image_gallery"],
      [class*="flix_hotspot"], [id*="flix_hotspot"], div[class*="hotspot"] {
        display: none !important;
        visibility: hidden !important;
      }
      #flix-specifications-inpage [flixtemplate-key="features"] > *:not(.inpage_selector_keyfeature) {
        display: none !important;
      }
      #flix-specifications-inpage [flixtemplate-key="specifications"],
      #flix-specifications-inpage [flixtemplate-key="features"],
      #flix-specifications-inpage .inpage_selector_keyfeature {
        display: block !important;
        visibility: visible !important;
      }
      #flix-specifications-inpage { width: 100%; background: transparent; }
      #flix-specifications-inpage [flixtemplate-key="specifications"] {
        background-color: transparent !important;
        padding: 0 !important;
      }
      #flix-specifications-inpage [flixtemplate-key="specifications"] h2,
      #flix-specifications-inpage [flixtemplate-key="specifications"] h3 {
        display: none !important;
      }
      #flix-specifications-inpage .inpage_spec-list {
        margin-bottom: 0 !important;
        border: none !important;
        padding: 0 !important;
      }
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
      #flix-specifications-inpage .inpage_spec-content {
        padding: 8px !important;
        overflow: hidden !important;
      }
      #flix-specifications-inpage .inpage_spec-content table { width: 100% !important; }
      #flix-specifications-inpage .inpage_spec-list { gap: 12px !important; }
      #flix-specifications-inpage .inpage_spec-row {
        display: grid !important;
        grid-template-columns: minmax(0, 180px) 1fr !important;
        gap: 8px !important;
        padding: 12px 0 !important;
        border-bottom: 1px solid #f0f2f7 !important;
      }
      #flix-specifications-inpage .inpage_spec-row:last-child { border-bottom: none !important; }
      #flix-specifications-inpage .inpage_spec-attribute,
      #flix-specifications-inpage .inpage_spec-value {
        font-size: 14px !important;
        line-height: 1.4 !important;
        color: #0a1124 !important;
      }
      #flix-specifications-inpage .inpage_spec-attribute { font-weight: 600 !important; }
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
        #flix-specifications-inpage .inpage_spec-content { padding: 16px !important; }
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
        #flix-specifications-inpage .inpage_selector_keyfeature { grid-template-columns: 1fr !important; }
        #flix-specifications-inpage .inpage_spec-header h2,
        #flix-specifications-inpage .inpage_spec-header .inpage_spec-title {
          font-size: 18px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    let targetMpn: string | null = null;
    let targetEan: string | null = null;

    if (mpn) {
      const skus = parseSkuString(mpn);
      if (skus.length > 0) targetMpn = skus[0];
    }
    if (!targetMpn && ean) {
      const eans = parseSkuString(ean);
      if (eans.length > 0) targetEan = eans[0];
    }
    if (!targetMpn && !targetEan) return;

    // Esperar al siguiente frame para asegurar que el DIV esté en el DOM
    const frameId = requestAnimationFrame(() => {
      // Verificar que el contenedor exista
      const inpageContainer = document.getElementById('flix-specifications-inpage');
      if (!inpageContainer) return;

      // Limpiar contenedor
      inpageContainer.innerHTML = '';

      // Remover script anterior si existe
      const existingScript = document.querySelector('script[src*="flixfacts.com/js/loader.js"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Crear script siguiendo documentación oficial
      const headID = document.getElementsByTagName("head")[0];
      const flixScript = document.createElement('script');
      flixScript.type = 'text/javascript';
      flixScript.async = true;

      flixScript.setAttribute('data-flix-distributor', '9329');
      flixScript.setAttribute('data-flix-language', 'f5');
      flixScript.setAttribute('data-flix-brand', 'Samsung');
      flixScript.setAttribute('data-flix-mpn', targetMpn || '');
      flixScript.setAttribute('data-flix-ean', targetEan || '');
      flixScript.setAttribute('data-flix-inpage', 'flix-specifications-inpage');
      flixScript.setAttribute('data-flix-button', '');
      flixScript.setAttribute('data-flix-price', '');
      flixScript.setAttribute('data-flix-hotspot', 'false');

      flixScript.onload = function () {
        applyStyles();
        if (typeof (window as unknown as { flixJsCallbacks?: { setLoadCallback: (fn: () => void, type: string) => void } }).flixJsCallbacks === "object") {
          (window as unknown as { flixJsCallbacks: { setLoadCallback: (fn: () => void, type: string) => void } }).flixJsCallbacks.setLoadCallback(function () {
            applyStyles();
          }, 'inpage');
        }
      };

      // Primero appendChild, luego asignar src
      headID.appendChild(flixScript);
      flixScript.src = '//media.flixfacts.com/js/loader.js';
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [mpn, ean, applyStyles]);

  if (!mpn && !ean) return null;

  return (
    <div ref={containerRef} className={`${className} w-full min-h-[200px] relative`}>
      <div id="flix-specifications-inpage" className="w-full" />
    </div>
  );
}

const FlixmediaDetails = memo(FlixmediaDetailsComponent, (prevProps, nextProps) => {
  return prevProps.mpn === nextProps.mpn && prevProps.ean === nextProps.ean;
});

FlixmediaDetails.displayName = 'FlixmediaDetails';
export default FlixmediaDetails;
