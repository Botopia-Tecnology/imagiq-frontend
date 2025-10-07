"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { SUPPORT_SECTIONS, SUPPORT_IMAGES } from "./constants";

type Props = {
  onItemClick: (label: string, href: string) => void;
};

export function MobileView({ onItemClick }: Props) {
  return (
    <div className="p-4">
      {/* Imágenes primero en mobile */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {SUPPORT_IMAGES.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => onItemClick(item.name, item.href)}
            className="flex flex-col items-center text-center"
          >
            {item.imageSrc ? (
              <div className="relative w-24 h-24 mb-2">
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="w-24 h-24 mb-2 bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-xs text-gray-500 text-center px-2">
                  Imagen
                </span>
              </div>
            )}
            <span className="text-sm font-semibold text-gray-900">
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Secciones de texto */}
      <div className="space-y-6">
        {SUPPORT_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-bold text-gray-500 mb-3 tracking-wide">
              {section.title}
            </h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => onItemClick(link.name, link.href)}
                    className="text-sm text-gray-900 hover:underline flex items-center gap-1"
                  >
                    {link.name}
                    {(link as { isExternal?: boolean }).isExternal && (
                      <ExternalLink className="w-3 h-3" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
