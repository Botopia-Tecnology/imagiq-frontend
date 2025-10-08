"use client";

import Link from "next/link";
import Image from "next/image";
import { MAIN_ITEMS, PROMOS } from "./constants";

type Props = {
  onItemClick: (label: string, href: string) => void;
};

export function MobileView({ onItemClick }: Props) {
  return (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        {MAIN_ITEMS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => onItemClick(item.name, item.href)}
            className="flex flex-col items-center text-center"
          >
            <div className="relative w-20 h-20 mb-2">
              <Image
                src={item.imageSrc}
                alt={item.imageAlt}
                width={80}
                height={80}
                className="object-contain"
                unoptimized
              />
            </div>
            <span className="text-xs font-semibold text-gray-900">
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          {PROMOS.map((promo) => (
            <Link
              key={promo.title}
              href={promo.href}
              onClick={() => onItemClick(promo.title, promo.href)}
              className="flex items-center gap-2 rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <Image
                  src={promo.imageSrc}
                  alt={promo.imageAlt}
                  width={40}
                  height={40}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="text-xs font-semibold text-gray-900 break-words">
                {promo.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
