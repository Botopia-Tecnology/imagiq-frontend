"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { MAIN_ITEMS, SIZES } from "./constants";

type Props = {
  onItemClick: (label: string, href: string) => void;
};

export function DesktopView({ onItemClick }: Props) {
  return (
    <div className="bg-white py-8 px-6 relative">
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("close-dropdown"))}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Cerrar menú"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>

      <div className="flex justify-center">
        <div className="flex gap-x-[1cm]">
          {MAIN_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onItemClick(item.name, item.href)}
              className="flex flex-col items-center text-center group"
              style={{ width: `${SIZES.main.container}px` }}
            >
              <div
                className="relative mb-2 transition-transform group-hover:scale-105"
                style={{ width: `${SIZES.main.image}px`, height: `${SIZES.main.image}px` }}
              >
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-semibold text-gray-900 leading-tight">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
