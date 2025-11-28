"use client";

import Script from "next/script";

export function ThreeDSScript() {
  return (
    <Script
      src="https://multimedia.epayco.co/general/3DS/validateThreeds.min.js"
      strategy="lazyOnload"
      onLoad={() => {
        console.log("✅ [Layout] Script de ePayco 3DS cargado exitosamente");
        console.log("🔍 [Layout] window.validate3ds disponible:", typeof window.validate3ds);
      }}
      onError={(e) => {
        console.error("❌ [Layout] Error cargando script de ePayco 3DS:", e);
      }}
    />
  );
}
