"use client";

import Link from "next/link";
import type { FC } from "react";
import { MAIN_ITEMS, PROMOS, SIZES } from "./constants";
import { ProductImage } from "@/components/navbar/components/ProductImage";

type Props = {
  onItemClick: (label: string, href: string) => void;
};

export const MobileView: FC<Props> = ({ onItemClick }) => (
  <div className="w-full p-4">
    <div className="grid grid-cols-2 gap-4 mb-6">
      {MAIN_ITEMS.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          onClick={() => onItemClick(item.name, item.href)}
          className="flex flex-col items-center text-center"
        >
          <div
            className="flex items-center justify-center rounded-full bg-white"
            style={{ width: SIZES.main.container, height: SIZES.main.container }}
          >
            <ProductImage
              src={item.imageSrc}
              alt={item.imageAlt}
              size={SIZES.main.image}
            />
          </div>
          <div className="mt-2 text-xs font-semibold text-gray-900">
            {item.name}
          </div>
        </Link>
      ))}
    </div>
    <div className="mt-4 grid grid-cols-1 gap-2">
      {PROMOS.slice(0, 4).map((promo) => (
        <Link
          key={promo.title}
          href={promo.href}
          className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 hover:bg-gray-50 transition"
          onClick={() => onItemClick(promo.title, promo.href)}
        >
          <ProductImage
            src={promo.imageSrc}
            alt={promo.imageAlt}
            size={SIZES.mobile.promo}
          />
          <div className="text-sm font-semibold text-gray-900 leading-5">
            {promo.title}
          </div>
        </Link>
      ))}
    </div>
  </div>
);
