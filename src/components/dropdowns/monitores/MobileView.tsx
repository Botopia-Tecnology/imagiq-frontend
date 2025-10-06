"use client";

import Link from "next/link";
import Image from "next/image";
import { MAIN_ITEMS } from "./constants";

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
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xs font-semibold text-gray-900">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
