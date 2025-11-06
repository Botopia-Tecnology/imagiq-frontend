/**
 * Banner Action Buttons Component
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { posthogUtils } from "@/lib/posthogClient";

export function BannerButtons() {
  const [isHoveringFlip, setIsHoveringFlip] = useState(false);

  const handleButtonClick = (product: string, action: string) => {
    posthogUtils.capture("galaxy_showcase_banner_click", {
      product,
      action,
      source: "showcase_banner",
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center">
      {/* Galaxy Watch8 Button - Underlined Style */}
      <Link
        href="/productos/multimedia/BSM-L500"
        className="group relative inline-block"
        onClick={() => handleButtonClick("Galaxy Watch8", "conoce_mas")}
      >
        <button className="pb-2 text-xs md:text-sm font-semibold text-black transition-all duration-300 relative inline-block">
          <span style={{ fontFamily: "'Samsung Sharp Sans', sans-serif", fontWeight: 700 }}>
            Conoce más Galaxy Watch8
          </span>
          {/* Animated Underline */}
          <span
            className="absolute bottom-0 left-0 h-px bg-black w-full transition-all duration-500 ease-out"
          />
        </button>
      </Link>

      {/* Galaxy Z Flip7 Button - Border with Hover Effect */}
      <Link
        href="/productos/multimedia/BSM-F766BE"
        className="group inline-block"
        onClick={() => handleButtonClick("Galaxy Z Flip7", "conoce_mas")}
        onMouseEnter={() => setIsHoveringFlip(true)}
        onMouseLeave={() => setIsHoveringFlip(false)}
      >
        <button
          className={`
            px-4 md:px-6 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold
            transition-all duration-300
            border border-black/40
            ${
              isHoveringFlip
                ? "bg-black text-white border-black"
                : "bg-transparent text-black"
            }
          `}
        >
          <span style={{ fontFamily: "'Samsung Sharp Sans', sans-serif", fontWeight: 700 }}>
            Conoce más Galaxy Z Flip7
          </span>
        </button>
      </Link>
    </div>
  );
}
