import Link from "next/link";
import type { FC } from "react";
import type { PromoItem } from "./types";
import { ProductImage } from "@/components/navbar/components/ProductImage";
import { getPromoImageSize } from "./utils";

type Props = {
  promo: PromoItem;
  onClick: (label: string, href: string) => void;
};

export const PromoCard: FC<Props> = ({ promo, onClick }) => (
  <Link
    href={promo.href}
    onClick={() => onClick(promo.title, promo.href)}
    className="flex items-center gap-2.5 rounded-xl bg-gray-100 p-2.5 hover:bg-gray-200 active:bg-gray-300 transition min-h-[70px]"
  >
    <div
      className="flex-shrink-0 flex items-center justify-center"
      style={{ width: 48, height: 48 }}
    >
      <ProductImage
        src={promo.imageSrc}
        alt={promo.imageAlt}
        size={getPromoImageSize(promo.title)}
      />
    </div>
    <p className="text-[12px] font-extrabold text-gray-900 leading-tight break-words">
      {promo.title}
    </p>
  </Link>
);
