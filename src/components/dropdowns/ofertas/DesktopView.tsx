"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { FEATURED_PRODUCTS, SIZES } from "./constants";

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

      <div className="flex gap-x-8">
        <div className="flex-1 pl-8">
          <div className="grid grid-cols-7 gap-6 mb-4">
            {FEATURED_PRODUCTS.slice(0, 7).map((product) => (
              <div
                key={product.name}
                className="flex flex-col items-center text-center group cursor-pointer"
                style={{ width: `${SIZES.product.container}px` }}
              >
                <div
                  className="relative mb-2 transition-transform group-hover:scale-105"
                  style={{ width: `${SIZES.product.image}px`, height: `${SIZES.product.image}px` }}
                >
                  <Image
                    src={product.imageSrc}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-semibold text-gray-900 leading-tight">
                  {product.name}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-6">
            {FEATURED_PRODUCTS.slice(7, 11).map((product) => (
              <div
                key={product.name}
                className="flex flex-col items-center text-center group cursor-pointer"
                style={{ width: `${SIZES.product.container}px` }}
              >
                <div
                  className="relative mb-2 transition-transform group-hover:scale-105"
                  style={{ width: `${SIZES.product.image}px`, height: `${SIZES.product.image}px` }}
                >
                  <Image
                    src={product.imageSrc}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-semibold text-gray-900 leading-tight">
                  {product.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
