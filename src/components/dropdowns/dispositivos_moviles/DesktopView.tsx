import type { FC } from "react";
import { MAIN_ITEMS, PROMOS } from "./constants";
import { MainItemCard } from "./MainItemCard";
import { PromoCard } from "./PromoCard";
import { CloseButton } from "@/components/navbar/components/CloseButton";

type Props = {
  onItemClick: (label: string, href: string) => void;
};

export const DesktopView: FC<Props> = ({ onItemClick }) => (
  <div
    className="w-full max-w-[1600px] mx-auto p-8 pl-24 pr-12 flex gap-16 relative"
    role="menu"
    aria-label="Dispositivos móviles"
  >
    <CloseButton onClick={() => onItemClick("close", "")} />

    <div className="flex-1">
      <ul className="grid grid-cols-5 gap-x-[3cm] gap-y-4">
        {MAIN_ITEMS.map((item) => (
          <MainItemCard key={item.name} item={item} onClick={onItemClick} />
        ))}
      </ul>
    </div>

    <div className="flex-shrink-0 flex gap-6 items-start">
      <div className="w-px bg-gray-200 h-full" aria-hidden />
      <div className="w-[370px]">
        <div className="grid grid-cols-2 gap-2.5">
          {PROMOS.map((promo) => (
            <PromoCard key={promo.title} promo={promo} onClick={onItemClick} />
          ))}
        </div>
      </div>
    </div>
  </div>
);
