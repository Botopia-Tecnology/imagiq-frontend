"use client";

import Link from "next/link";
import Image from "next/image";
import type { FC } from "react";

type SubMenuItem = {
  name: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

const ACCESORIOS_ITEMS: SubMenuItem[] = [
  {
    name: "Accesorios para Smartphones Galaxy",
    href: "/productos/accesorios?seccion=smartphones-galaxy",
    imageSrc: "/CATEGORIAS/ACC/Smartphone-galaxy.webp",
    imageAlt: "Accesorios para Smartphones Galaxy",
  },
  {
    name: "Accesorios para las Galaxy Tab",
    href: "/productos/accesorios?seccion=galaxy-tab",
    imageSrc: "/CATEGORIAS/ACC/Galaxy-tab.webp",
    imageAlt: "Accesorios para las Galaxy Tab",
  },
  {
    name: "Accesorios para los Galaxy Watch",
    href: "/productos/accesorios?seccion=galaxy-watch",
    imageSrc: "/CATEGORIAS/ACC/Galaxy-watch.webp",
    imageAlt: "Accesorios para los Galaxy Watch",
  },
  {
    name: "Accesorios Galaxy Buds",
    href: "/productos/accesorios?seccion=galaxy-buds",
    imageSrc: "/CATEGORIAS/ACC/Galaxy-buds.webp",
    imageAlt: "Accesorios Galaxy Buds",
  },
  {
    name: "Accesorios de audio",
    href: "/productos/accesorios?seccion=audio",
    imageSrc: "/CATEGORIAS/ACC/Audio.webp",
    imageAlt: "Accesorios de audio",
  },
  {
    name: "Accesorios para proyector",
    href: "/productos/accesorios?seccion=proyector",
    imageSrc: "/CATEGORIAS/ACC/Proyector.webp",
    imageAlt: "Accesorios para proyector",
  },
];

type Props = {
  onClose: () => void;
};

export const AccesoriosSubmenu: FC<Props> = ({ onClose }) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-x-8 mb-6">
        {ACCESORIOS_ITEMS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-2 mb-3"
          >
            <div className="w-12 h-12 flex-shrink-0 relative">
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xs text-gray-900 whitespace-pre-line leading-tight" style={{ fontWeight: 900 }}>
              {item.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
