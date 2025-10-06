"use client";

import Image from "next/image";
import { FEATURED_PRODUCTS } from "./constants";

type Props = {
  onItemClick: (label: string, href: string) => void;
};

export function MobileView({ onItemClick }: Props) {
  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {FEATURED_PRODUCTS.map((product) => (
          <div
            key={product.name}
            className="flex flex-col items-center text-center cursor-pointer"
          >
            <div className="relative w-16 h-16 mb-2">
              <Image
                src={product.imageSrc}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xs font-semibold text-gray-900">
              {product.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
