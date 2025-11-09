import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import { posthogUtils } from "@/lib/posthogClient";

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
      src={
        "https://res.cloudinary.com/dqsdl9bwv/image/upload/Dise%C3%B1o_sin_t%C3%ADtulo_-_2025-11-08T184830.515_zsqkiu"
      }
      alt="Samsung"
      height={42}
      width={118}
      className="h-10 w-auto"
      priority
    />
  </Link>
);
