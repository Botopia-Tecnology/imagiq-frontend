import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { posthogUtils } from "@/lib/posthogClient";
import logoSamsungWhite from "@/img/logo_Samsung.png";
import logoSamsungBlack from "@/img/Samsung_black.png";

type Props = {
  showWhiteLogo: boolean;
  onNavigate: () => void;
};

export const NavbarLogo: FC<Props> = ({ showWhiteLogo, onNavigate }) => (
  <Link
    href="/"
    onClick={(e) => {
      e.preventDefault();
      posthogUtils.capture("logo_click", { source: "navbar" });
      onNavigate();
    }}
    aria-label="Inicio"
    className="flex items-center gap-2 shrink-0"
  >
    <Image
      src={showWhiteLogo ? "/frame_white.png" : "/frame_black.png"}
      alt="Q Logo"
      height={44}
      width={44}
      className="h-11 w-11 min-w-[44px]"
      priority
    />
    <Image
      src={showWhiteLogo ? logoSamsungWhite : logoSamsungBlack}
      alt="Samsung"
      height={42}
      width={118}
      className="h-10 w-auto"
      priority
    />
  </Link>
);
