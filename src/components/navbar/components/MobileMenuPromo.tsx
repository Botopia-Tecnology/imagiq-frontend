"use client";

import Link from "next/link";
import type { FC } from "react";
import { useDynamicBanner } from "@/hooks/useDynamicBanner";

type Props = {
  onClose: () => void;
};

export const MobileMenuPromo: FC<Props> = ({ onClose }) => {
  const { banner, loading } = useDynamicBanner("notification");

  // No mostrar nada si está cargando o no hay banner
  if (loading || !banner) {
    return null;
  }

  return (
    <div className="sticky top-[73px] bg-black text-white p-4 text-center z-10">
      {banner.title && (
        <h2 className="text-base font-bold mb-1">{banner.title}</h2>
      )}
      {banner.description && (
        <p className="text-sm mb-3">{banner.description}</p>
      )}
      {banner.cta && banner.link_url && (
        <Link
          href={banner.link_url}
          onClick={onClose}
          className="inline-block bg-white text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100"
        >
          {banner.cta}
        </Link>
      )}
    </div>
  );
};
