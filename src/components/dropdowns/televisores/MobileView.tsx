"use client";

import Link from "next/link";
import { MAIN_ITEMS, PROMOS } from "./constants";

type Props = {
  onItemClick: (label: string, href: string) => void;
};

export function MobileView({ onItemClick }: Props) {
  return (
    <div className="p-4">
      <nav className="space-y-3">
        {MAIN_ITEMS.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={() => onItemClick(item.name, item.href)}
            className="block text-base font-semibold text-gray-900 hover:text-blue-600"
          >
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <nav className="space-y-3">
          {PROMOS.map((promo) => (
            <Link
              key={promo.title}
              href={promo.href}
              onClick={() => onItemClick(promo.title, promo.href)}
              className="block text-sm font-semibold text-gray-700 hover:text-blue-600"
            >
              {promo.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
