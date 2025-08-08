"use client";

import Image from "next/image";
import Link from "next/link";
import logoImagiq from "@/img/logo_imagiq.png";
import { cn } from "@/lib/utils";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  onClick?: () => void;
}

export default function Logo({
  width = 170,
  height = 170,
  className,
  onClick,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
    >
      <Image
        src={logoImagiq}
        alt="Imagiq Store"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </Link>
  );
}
