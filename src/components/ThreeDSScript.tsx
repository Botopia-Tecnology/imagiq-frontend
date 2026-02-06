"use client";

import Script from "next/script";

export function ThreeDSScript() {
  return (
    <Script
      src="https://multimedia.epayco.co/general/3DS/validateThreeds.min.js"
      strategy="lazyOnload"
      onError={(e) => {
        console.error("Error loading ePayco 3DS script:", e);
      }}
    />
  );
}
