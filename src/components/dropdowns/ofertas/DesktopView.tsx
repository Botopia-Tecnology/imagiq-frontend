"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { FEATURED_PRODUCTS, PROMOS, SIZES } from "./constants";

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
            {FEATURED_PRODUCTS.slice(7, 11).map((product, index) => (
              <div
                key={product.name}
                className="flex flex-col items-center text-center group cursor-pointer"
                style={{
                  width: `${SIZES.product.container}px`,
                  gridColumn: index === 3 ? 5 : undefined
                }}
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

        <div className="flex items-start gap-6">
          <div className="w-px bg-gray-200 self-stretch" style={{ minHeight: '200px' }} />

          <div className="w-[420px] flex-shrink-0 pr-6">
            <div className="grid grid-cols-2 gap-2.5">
              {PROMOS.map((promo) => (
                <Link
                  key={promo.title}
                  href={promo.href}
                  onClick={() => onItemClick(promo.title, promo.href)}
                  className="flex items-center gap-2.5 rounded-xl bg-gray-100 p-2.5 hover:bg-gray-200 active:bg-gray-300 transition min-h-[72px]"
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ width: 48, height: 48 }}
                  >
                    <Image
                      src={promo.imageSrc}
                      alt={promo.imageAlt}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-[12px] font-extrabold text-gray-900 leading-tight break-words">
                    {promo.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
