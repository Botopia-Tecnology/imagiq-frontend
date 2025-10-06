"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { MAIN_ITEMS, PROMOS, SIZES } from "./constants";

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

      <div className="flex gap-x-[1.5cm]">
        <div className="flex-1">
          <div className="grid grid-cols-7 gap-6 mb-4">
            {MAIN_ITEMS.slice(0, 7).map((item) => (
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

          <div className="grid grid-cols-7 gap-6">
            <Link
              href={MAIN_ITEMS[7].href}
              onClick={() => onItemClick(MAIN_ITEMS[7].name, MAIN_ITEMS[7].href)}
              className="flex flex-col items-center text-center group"
              style={{ width: `${SIZES.main.container}px` }}
            >
              <div
                className="relative mb-2 transition-transform group-hover:scale-105"
                style={{ width: `${SIZES.main.image}px`, height: `${SIZES.main.image}px` }}
              >
                <Image
                  src={MAIN_ITEMS[7].imageSrc}
                  alt={MAIN_ITEMS[7].imageAlt}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-semibold text-gray-900 leading-tight">
                {MAIN_ITEMS[7].name}
              </span>
            </Link>

            <Link
              href={MAIN_ITEMS[8].href}
              onClick={() => onItemClick(MAIN_ITEMS[8].name, MAIN_ITEMS[8].href)}
              className="flex flex-col items-center text-center group"
              style={{ width: `${SIZES.main.container}px` }}
            >
              <div
                className="relative mb-2 transition-transform group-hover:scale-105"
                style={{ width: `${SIZES.main.image}px`, height: `${SIZES.main.image}px` }}
              >
                <Image
                  src={MAIN_ITEMS[8].imageSrc}
                  alt={MAIN_ITEMS[8].imageAlt}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-semibold text-gray-900 leading-tight">
                {MAIN_ITEMS[8].name}
              </span>
            </Link>
          </div>
        </div>

        <div className="flex items-start gap-6">
          <div className="w-px bg-gray-200 self-stretch" style={{ minHeight: '200px' }} />

          <div className="w-[450px] flex-shrink-0 pr-8">
            <div className="grid grid-cols-2 gap-3">
              {PROMOS.map((promo) => (
                <Link
                  key={promo.title}
                  href={promo.href}
                  onClick={() => onItemClick(promo.title, promo.href)}
                  className="flex items-center gap-3 rounded-xl bg-gray-100 p-3 hover:bg-gray-200 active:bg-gray-300 transition min-h-[80px]"
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ width: 52, height: 52 }}
                  >
                    <Image
                      src={promo.imageSrc}
                      alt={promo.imageAlt}
                      width={52}
                      height={52}
                      className="object-contain"
                    />
                  </div>
                  <p className="text-[13px] font-extrabold text-gray-900 leading-tight">
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
