"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, X } from "lucide-react";
import { SUPPORT_SECTIONS, SUPPORT_IMAGES } from "./constants";

type Props = {
  onItemClick: (label: string, href: string) => void;
  onClose?: () => void;
};

export function DesktopView({ onItemClick, onClose }: Props) {
  return (
    <div className="bg-white py-6 px-23 relative">
      <button
        onClick={() => {
          window.dispatchEvent(new CustomEvent("close-dropdown"));
          onClose?.();
        }}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        aria-label="Cerrar menú"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>

      <div className="flex gap-120">
        {/* Secciones de texto en 2 columnas */}
        <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-8">
          {SUPPORT_SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col">
              <h3 className="text-sm font-extrabold text-gray-500 mb-4 tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      onClick={() => onItemClick(link.name, link.href)}
                      className="text-xs text-gray-900 hover:underline flex items-center gap-1 group"
                    >
                      {link.name}
                      {(link as { isExternal?: boolean }).isExternal && (
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sección de imágenes - horizontal */}
        <div className="flex gap-8 border-l border-gray-200 pl-8 pr-8">
          {SUPPORT_IMAGES.map((item, idx) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onItemClick(item.name, item.href)}
              className="group"
            >
              {item.imageSrc ? (
                <div className="relative w-30 h-42 transition-transform group-hover:scale-105 rounded-lg bg-gray-100 overflow-hidden flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-4">
                    <Image
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      width={idx === 1 ? 50 : 70}
                      height={idx === 1 ? 50 : 70}
                       className={`object-contain ${idx === 1 ? 'mt-3' : ''} ${idx === 0 ? '-mt-6' : ''}`}
                    />
                  </div>
                  <div className="bg-gray-100 py-3 px-2">
                    <span
  className={`text-xs font-semibold text-gray-900 text-center block ${
    idx === 0 ? "-mt-10" : ""
  }`}
>
  {item.name}
</span>
                  </div>
                </div>
              ) : (
                <div className="relative w-36 h-40 bg-gray-100 flex flex-col rounded-lg overflow-hidden">
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-xs text-gray-500 text-center px-2">
                      Imagen aquí
                    </span>
                  </div>
                  <div className="bg-gray-100 py-3 px-2">
                    <span className="text-sm font-semibold text-gray-900 text-center block">
                      {item.name}
                    </span>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
