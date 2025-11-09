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
      className="h-11 w-11 min-w-11"
      priority
    />
    <Image
      src="https://res.cloudinary.com/dnglv0zqg/image/upload/v1760575601/Samsung_black_ec1b9h.svg"
      alt="Samsung"
      height={42}
      width={118}
      className={
        showWhiteLogo ? "h-10 w-auto brightness-0 invert" : "h-10 w-auto"
      }
      priority
    />
  </Link>
);
