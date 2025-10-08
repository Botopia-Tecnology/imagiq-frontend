"use client";

import Link from "next/link";
import Image from "next/image";
import type { FC } from "react";

type SubMenuItem = {
  name: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  twoLines?: boolean;
};

type SubMenuLink = {
  title: string;
  href: string;
};

const DISPOSITIVOS_MOVILES_ITEMS: SubMenuItem[] = [
  {
    name: "Smartphones\nGalaxy",
    href: "/productos/dispositivos-moviles?seccion=smartphones",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773359/Smartphones_galaxy_wfxaqa.webp",
    imageAlt: "Smartphones Galaxy",
    twoLines: true,
  },
  {
    name: "Galaxy Tab",
    href: "/productos/dispositivos-moviles?seccion=tabletas",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773375/Galaxy_Tab_r2iqdr.webp",
    imageAlt: "Galaxy Tab",
  },
  {
    name: "Galaxy Watch",
    href: "/productos/dispositivos-moviles?seccion=relojes",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773381/Galaxy_Watch_d7sxjj.webp",
    imageAlt: "Galaxy Watch",
  },
  {
    name: "Galaxy Buds",
    href: "/productos/dispositivos-moviles?seccion=buds",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773371/Galaxy_Buds_hjecfo.webp",
    imageAlt: "Galaxy Buds",
  },
  {
    name: "Accesorios para\nGalaxy",
    href: "/productos/dispositivos-moviles?seccion=accesorios",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773382/Accesorios_para_galaxy_wrntkr.webp",
    imageAlt: "Accesorios para Galaxy",
    twoLines: true,
  },
];

const DISPOSITIVOS_MOVILES_LINKS: SubMenuLink[] = [
  { title: "Descubre los dispositivos móviles", href: "/productos/dispositivos-moviles" },
  { title: "Galaxy AI", href: "/productos/dispositivos-moviles?seccion=galaxy-ai" },
  { title: "One UI", href: "/productos/dispositivos-moviles?seccion=one-ui" },
  { title: "Samsung Health", href: "/productos/dispositivos-moviles?seccion=samsung-health" },
  { title: "Aplicaciones y Servicios", href: "/productos/dispositivos-moviles?seccion=apps-servicios" },
  { title: "¿Por qué elegir Galaxy?", href: "/productos/dispositivos-moviles?seccion=por-que-galaxy" },
  { title: "Cambia a Galaxy", href: "/productos/dispositivos-moviles?seccion=cambia" },
  { title: "Estreno y Entrego", href: "/productos/dispositivos-moviles?seccion=estreno-entrega" },
];

type Props = {
  onClose: () => void;
};

export const DispositivosMovilesSubmenu: FC<Props> = ({ onClose }) => {
  const column1 = DISPOSITIVOS_MOVILES_ITEMS.slice(0, 3);
  const column2 = DISPOSITIVOS_MOVILES_ITEMS.slice(3, 5);

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-x-8 mb-6">
        <div className="space-y-3">
          {column1.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-2"
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

        <div className="space-y-3">
          {column2.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-2"
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

      <div className="border-t border-gray-300 pt-4 mt-2">
        <h3 className="text-base mb-3" style={{ fontWeight: 900 }}>Descubre los dispositivos móviles</h3>
        <nav className="space-y-1">
          {DISPOSITIVOS_MOVILES_LINKS.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              onClick={onClose}
              className="block py-2 text-sm text-gray-900 hover:text-blue-600"
              style={{ fontWeight: 900 }}
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
