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

type SubMenuLink = {
  title: string;
  href: string;
};

const TELEVISORES_ITEMS: SubMenuItem[] = [
  {
    name: "Neo QLED",
    href: "/productos/televisores?seccion=neo-qled",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773443/NEO_QLED_r1n0ew.webp",
    imageAlt: "Neo QLED",
  },
  {
    name: "OLED",
    href: "/productos/televisores?seccion=oled",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773443/OLED_fzt6n5.webp",
    imageAlt: "OLED",
  },
  {
    name: "QLED",
    href: "/productos/televisores?seccion=qled",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773451/Q_LED_zlnq9y.webp",
    imageAlt: "QLED",
  },
  {
    name: "Crystal UHD",
    href: "/productos/televisores?seccion=crystal-uhd",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773443/CRYSTAL_UHD_cri2ns.webp",
    imageAlt: "Crystal UHD",
  },
  {
    name: "The Frame",
    href: "/productos/televisores?seccion=the-frame",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773439/THE_FRAME_gflmei.webp",
    imageAlt: "The Frame",
  },
  {
    name: "Dispositivos de audio",
    href: "/productos/televisores?seccion=audio",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773435/DISPOSITIVOS_DE_AUDIO_hak34x.webp",
    imageAlt: "Dispositivos de audio",
  },
  {
    name: "Proyectores",
    href: "/productos/televisores?seccion=proyectores",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773435/PROYECTORES_mdrj8w.webp",
    imageAlt: "Proyectores",
  },
  {
    name: "Accesorios para televisor",
    href: "/productos/televisores?seccion=accesorios-tv",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773439/ACCESORIOS_PARA_TELEVISOR_icsuyv.webp",
    imageAlt: "Accesorios para televisor",
  },
  {
    name: "Accesorios de audio",
    href: "/productos/televisores?seccion=accesorios-audio",
    imageSrc: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773434/ACCESORIOS_DE_AUDIO_xrmytj.webp",
    imageAlt: "Accesorios de audio",
  },
];

const TELEVISORES_LINKS: SubMenuLink[] = [
  { title: "¿Por qué elegir un TV Samsung?", href: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773451/TV_SAMSUNG_tvohw1.webp" },
  { title: "¿Por qué elegir Samsung OLED?", href: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773439/PORQUE_OLED_vw0rjn.webp"},
  { title: "¿Por qué elegir los televisores Neo QLED?", href: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773443/PORQUE_NEOQLED_rrpss3.webp" },
  { title: "¿Por qué elegir The Frame?", href: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773439/PORQUE_THEFRAME_cnbgqq.webp" },
  { title: "Ayuda para elegir mi televisor", href: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773433/Ayuda_rjzowj.webp" },
  { title: "Elija mi dispositivo de audio", href: "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773433/Elija-dispositivo_sqstcg.webp" },
];

type Props = {
  onClose: () => void;
};

export const TelevisoresSubmenu: FC<Props> = ({ onClose }) => {
  const column1 = TELEVISORES_ITEMS.slice(0, 5);
  const column2 = TELEVISORES_ITEMS.slice(5, 9);

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
        <nav className="space-y-1">
          {TELEVISORES_LINKS.map((link) => (
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
