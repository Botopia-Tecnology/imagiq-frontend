"use client";

import Image from "next/image";
import Link from "next/link";
import logoSamsungWhite from "@/img/logo_Samsung.png";
import logoSamsungBlack from "@/img/Samsung_black.png";
import { posthogUtils } from "@/lib/posthogClient";

interface NavbarLogoProps {
  showWhiteLogo: boolean;
}

export default function NavbarLogo({ showWhiteLogo }: NavbarLogoProps) {
  return (
    <div className="flex items-center flex-shrink-0">
      <Link
        href="/"
        onClick={() => posthogUtils.capture("logo_click", { source: "navbar" })}
        aria-label="Inicio"
        className="flex items-center gap-2"
      >
        <Image
          src={showWhiteLogo ? "/frame_311_white.png" : "/frame_311_black.png"}
          alt="Q Logo"
          height={32}
          width={32}
          style={{ minWidth: 32, width: 32 }}
          priority
        />
        <Image
          src={showWhiteLogo ? logoSamsungWhite : logoSamsungBlack}
          alt="Samsung Logo"
          height={32}
          style={{ minWidth: 120, width: "auto" }}
          priority
        />
        <Image
          src={showWhiteLogo ? "/store_white.png" : "/store_black.png"}
          alt="Store Logo"
          height={20}
          width={60}
          style={{ minWidth: 36, width: 36 }}
          priority
        />
        <span
          className={
            showWhiteLogo
              ? "ml-2 text-base font-bold tracking-wide text-white select-none"
              : "ml-2 text-base font-bold tracking-wide text-black select-none"
          }
          style={{
            marginLeft: 8,
            marginRight: 0,
            cursor: "pointer",
            letterSpacing: "0.08em",
          }}
        >
          Store
        </span>
      </Link>
    </div>
  );
}
