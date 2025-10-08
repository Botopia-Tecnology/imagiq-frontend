"use client";

import Link from "next/link";
import Image from "next/image";
import { MAIN_ITEMS, SIZES } from "./constants";

type Props = {
  onItemClick: (label: string, href: string) => void;
};

export function MobileView({ onItemClick }: Props) {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {MAIN_ITEMS.map((item) => {
          // Determinar si este item debe usar tamaño grande
          const isLargeItem = [
            "Accesorios para las Galaxy Tab",
            "Accesorios para los Galaxy Watch",
            "Accesorios Galaxy Buds"
          ].includes(item.name);
          const imageSize = isLargeItem ? 112 : 80;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onItemClick(item.name, item.href)}
              className="flex flex-col items-center text-center"
            >
              <div className={`relative mb-2 ${isLargeItem ? 'w-28 h-28' : 'w-20 h-20'}`}>
                <Image
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  width={imageSize}
                  height={imageSize}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-xs font-semibold text-gray-900">
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
