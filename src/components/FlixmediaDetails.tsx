/**
 * FlixmediaDetails Component
 * 
 * Carga especificaciones de Flixmedia.
 * Usa IDs dinámicos para evitar conflictos en el DOM durante navegación SPA.
 */

"use client";

import { useEffect, useRef, memo, useCallback, useState } from "react";
import { parseSkuString } from "@/lib/flixmedia";

declare global {
  interface Window {
    flixJsCallbacks?: {
      setLoadCallback: (fn: () => void, type?: string) => void;
      loadService: (type: string) => void;
    };
  }
}

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
  // Generar ID único para este montaje
  const [uniqueId] = useState(() => `flix-specifications-${Math.random().toString(36).substr(2, 9)}`);
  const currentMpnRef = useRef<string | null>(null);

  const applyStyles = useCallback(() => {
    if (document.getElementById('flixmedia-specifications-styles')) return;

    const style = document.createElement('style');
    style.id = 'flixmedia-specifications-styles';
    style.textContent = `
      [id^="flix-specifications-"] [flixtemplate-key="footnotes"],
      [id^="flix-specifications-"] [flixtemplate-key="image_gallery"],
      [class*="flix_hotspot"], [id*="flix_hotspot"], div[class*="hotspot"] {
        display: none !important;
        visibility: hidden !important;
      }
      [id^="flix-specifications-"] [flixtemplate-key="features"] > *:not(.inpage_selector_keyfeature) {
        display: none !important;
      }
      [id^="flix-specifications-"] [flixtemplate-key="specifications"],
      [id^="flix-specifications-"] [flixtemplate-key="features"],
      [id^="flix-specifications-"] .inpage_selector_keyfeature {
        display: block !important;
        visibility: visible !important;
      }
      [id^="flix-specifications-"] { width: 100%; background: transparent; }
      [id^="flix-specifications-"] [flixtemplate-key="specifications"] {
        background-color: transparent !important;
        padding: 0 !important;
      }
      [id^="flix-specifications-"] [flixtemplate-key="specifications"] h2,
      [id^="flix-specifications-"] [flixtemplate-key="specifications"] h3 {
        display: none !important;
      }
      [id^="flix-specifications-"] .inpage_spec-list {
        margin-bottom: 0 !important;
        border: none !important;
        padding: 0 !important;
      }
      [id^="flix-specifications-"] .inpage_spec-header {
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
        padding: 16px 8px !important;
      }
      @media (min-width: 640px) {
        [id^="flix-specifications-"] .inpage_spec-header {
          flex-direction: row !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 20px 16px !important;
        }
      }
      [id^="flix-specifications-"] .inpage_spec-header h2,
      [id^="flix-specifications-"] .inpage_spec-header .inpage_spec-title {
        font-size: 20px !important;
        line-height: 1.3 !important;
        margin: 0 !important;
        text-align: center !important;
      }
      @media (min-width: 640px) {
        [id^="flix-specifications-"] .inpage_spec-header h2,
        [id^="flix-specifications-"] .inpage_spec-header .inpage_spec-title {
          font-size: 24px !important;
          text-align: left !important;
        }
      }
      @media (min-width: 768px) {
        [id^="flix-specifications-"] .inpage_spec-header h2,
        [id^="flix-specifications-"] .inpage_spec-header .inpage_spec-title {
          font-size: 28px !important;
        }
      }
      [id^="flix-specifications-"] .inpage_spec-header button,
      [id^="flix-specifications-"] .inpage_spec-header .inpage_spec-expand-btn {
        font-size: 13px !important;
        padding: 8px 16px !important;
        white-space: nowrap !important;
        width: 100% !important;
        max-width: 200px !important;
        margin: 0 auto !important;
      }
      @media (min-width: 640px) {
        [id^="flix-specifications-"] .inpage_spec-header button,
        [id^="flix-specifications-"] .inpage_spec-header .inpage_spec-expand-btn {
          font-size: 14px !important;
          padding: 10px 20px !important;
          width: auto !important;
          margin: 0 !important;
        }
      }
      [id^="flix-specifications-"] .inpage_spec-content {
        padding: 8px !important;
        overflow: hidden !important;
      }
      [id^="flix-specifications-"] .inpage_spec-content table { width: 100% !important; }
      [id^="flix-specifications-"] .inpage_spec-list { gap: 12px !important; }
      [id^="flix-specifications-"] .inpage_spec-row {
        display: grid !important;
        grid-template-columns: minmax(0, 180px) 1fr !important;
        gap: 8px !important;
        padding: 12px 0 !important;
        border-bottom: 1px solid #f0f2f7 !important;
      }
      [id^="flix-specifications-"] .inpage_spec-row:last-child { border-bottom: none !important; }
      [id^="flix-specifications-"] .inpage_spec-attribute,
      [id^="flix-specifications-"] .inpage_spec-value {
        font-size: 14px !important;
        line-height: 1.4 !important;
        color: #0a1124 !important;
      }
      [id^="flix-specifications-"] .inpage_spec-attribute { font-weight: 600 !important; }
      [id^="flix-specifications-"] .inpage_selector_keyfeature {
        display: grid !important;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)) !important;
        gap: 12px !important;
        list-style: none !important;
        padding: 0 !important;
        margin: 0 0 24px !important;
      }
      [id^="flix-specifications-"] .inpage_selector_keyfeature li,
      [id^="flix-specifications-"] .inpage_selector_keyfeature .inpage_keyfeature-item {
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
      [id^="flix-specifications-"] .inpage_selector_keyfeature img,
      [id^="flix-specifications-"] .inpage_selector_keyfeature svg {
        max-width: 48px !important;
        width: 48px !important;
        height: auto !important;
        object-fit: contain !important;
      }
      [id^="flix-specifications-"] .inpage_selector_keyfeature p,
      [id^="flix-specifications-"] .inpage_selector_keyfeature span {
        font-size: 13px !important;
        line-height: 1.35 !important;
        color: #0a1124 !important;
      }
      @media (min-width: 640px) {
        [id^="flix-specifications-"] .inpage_spec-content { padding: 16px !important; }
      }
      @media (max-width: 768px) {
        [id^="flix-specifications-"] .inpage_spec-row {
          grid-template-columns: 1fr !important;
          padding: 10px 0 !important;
        }
      }
      @media (max-width: 640px) {
        [id^="flix-specifications-"] .inpage_selector_keyfeature {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
      }
      @media (max-width: 480px) {
        [id^="flix-specifications-"] .inpage_selector_keyfeature { grid-template-columns: 1fr !important; }
        [id^="flix-specifications-"] .inpage_spec-header h2,
        [id^="flix-specifications-"] .inpage_spec-header .inpage_spec-title {
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

    const productKey = targetMpn || targetEan || '';

    if (currentMpnRef.current === productKey) return;
    currentMpnRef.current = productKey;

    // Función para verificar si el contenedor está listo
    const waitForContainer = (): Promise<HTMLElement> => {
      return new Promise((resolve, reject) => {
        let attempts = 0;
        const maxAttempts = 50;

        const checkContainer = () => {
          attempts++;
          const container = document.getElementById(uniqueId);

          if (container) {
            resolve(container);
          } else if (attempts >= maxAttempts) {
            reject(new Error('Container timeout'));
          } else {
            setTimeout(checkContainer, 100);
          }
        };

        checkContainer();
      });
    };

    const loadScript = (container: HTMLElement) => {
      container.innerHTML = '';

      // Limpiar scripts anteriores específicos
      const oldScripts = document.querySelectorAll(`script[data-flix-inpage="${uniqueId}"]`);
      oldScripts.forEach(s => s.remove());

      const headID = document.getElementsByTagName("head")[0];
      const flixScript = document.createElement('script');
      flixScript.type = 'text/javascript';
      flixScript.async = true;

      flixScript.setAttribute('data-flix-distributor', '9329');
      flixScript.setAttribute('data-flix-language', 'f5');
      flixScript.setAttribute('data-flix-brand', 'Samsung');
      flixScript.setAttribute('data-flix-mpn', targetMpn || '');
      flixScript.setAttribute('data-flix-ean', targetEan || '');
      // ID Único
      flixScript.setAttribute('data-flix-inpage', uniqueId);
      flixScript.setAttribute('data-flix-button', '');
      flixScript.setAttribute('data-flix-price', '');
      flixScript.setAttribute('data-flix-hotspot', 'false');

      flixScript.onload = function () {
        applyStyles();
        if (typeof window.flixJsCallbacks === "object") {
          window.flixJsCallbacks.setLoadCallback(function () {
            applyStyles();
          }, 'inpage');
        }
      };

      headID.appendChild(flixScript);
      flixScript.src = '//media.flixfacts.com/js/loader.js';
    };

    waitForContainer()
      .then(loadScript)
      .catch(err => console.error('[FLIXMEDIA DETAILS] Error:', err));

    return () => {
      const scripts = document.querySelectorAll(`script[data-flix-inpage="${uniqueId}"]`);
      scripts.forEach(s => s.remove());
      currentMpnRef.current = null;
    };
  }, [mpn, ean, applyStyles, uniqueId]);

  if (!mpn && !ean) return null;

  return (
    <div ref={containerRef} className={`${className} w-full min-h-[200px] relative`}>
      <div id={uniqueId} className="w-full" />
    </div>
  );
}

const FlixmediaDetails = memo(FlixmediaDetailsComponent, (prevProps, nextProps) => {
  return prevProps.mpn === nextProps.mpn && prevProps.ean === nextProps.ean;
});

FlixmediaDetails.displayName = 'FlixmediaDetails';
export default FlixmediaDetails;
