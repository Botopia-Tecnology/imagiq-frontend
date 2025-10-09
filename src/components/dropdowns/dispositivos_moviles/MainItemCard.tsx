import Link from "next/link";
import type { FC } from "react";
import type { MainItem } from "./types";
import { SIZES } from "./constants";
import { ProductImage } from "@/components/navbar/components/ProductImage";
import { NameTwoLines } from "@/components/navbar/components/NameTwoLines";

type Props = {
  item: MainItem;
  onClick: (label: string, href: string) => void;
};

export const MainItemCard: FC<Props> = ({ item, onClick }) => (
  <li>
    <Link
      href={item.href}
      onClick={() => onClick(item.name, item.href)}
      className="group flex flex-col items-center text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl"
    >
      <div
        className="flex items-center justify-center rounded-full bg-white transition-transform group-hover:scale-105 group-active:scale-95"
        style={{ width: SIZES.main.container, height: SIZES.main.container }}
      >
        <ProductImage
          src={item.imageSrc}
          alt={item.imageAlt}
          size={SIZES.main.image}
        />
      </div>
      <div className="mt-2 text-[13px] font-black leading-tight text-black">
        {item.twoLinesName ? (
          <span className="flex flex-col whitespace-pre-line">
            <NameTwoLines text={item.twoLinesName} />
          </span>
        ) : (
          item.name
        )}
      </div>
    </Link>
  </li>
);
