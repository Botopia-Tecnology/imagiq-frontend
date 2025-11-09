"use client";

import Link from "next/link";
import type { FC } from "react";

type SubMenuItem = {
  name: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

const MONITORES_ITEMS: SubMenuItem[] = [
  {
    name: "Odyssey Gaming",
    href: "/productos/monitores?seccion=odyssey-gaming",
    imageSrc:
      "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773426/Odyssey-gaming_xmgp2x.webp",
    imageAlt: "Odyssey Gaming",
  },
  {
    name: "ViewFinity High Resolution",
    href: "/productos/monitores?seccion=viewfinity-high-resolution",
    imageSrc:
      "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773428/View-finity-high-resolution_mfrm6w.webp",
    imageAlt: "ViewFinity High Resolution",
  },
  {
    name: "Smart Monitor",
    href: "/productos/monitores?seccion=smart-monitor",
    imageSrc:
      "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773428/Smart-monitor_mp15xd.webp",
    imageAlt: "Smart Monitor",
  },
  {
    name: "Essential Monitor",
    href: "/productos/monitores?seccion=essential-monitor",
    imageSrc:
      "https://res.cloudinary.com/dqay3uml6/image/upload/v1759773429/Essential-monitor_fzlkt0.webp",
    imageAlt: "Essential Monitor",
  },
];

type Props = {
  onClose: () => void;
};

export const MonitoresSubmenu: FC<Props> = ({ onClose }) => {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-x-8 mb-6">
        {MONITORES_ITEMS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-2 mb-3"
          >
            <div className="w-12 h-12 shrink-0 relative">
              {/* Imagen eliminada */}
            </div>
            <p
              className="text-xs text-gray-900 whitespace-pre-line leading-tight"
              style={{ fontWeight: 900 }}
            >
              {item.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
