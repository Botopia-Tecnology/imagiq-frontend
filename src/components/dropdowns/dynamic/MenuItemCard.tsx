import type { FC } from "react";
import Link from "next/link";
import type { MenuItem } from "./types";

type Props = {
  item: MenuItem;
  onClick: (label: string, href: string) => void;
};

export const MenuItemCard: FC<Props> = ({ item, onClick }) => {
  return (
    <li className="list-none">
      <Link
        href={item.href}
        onClick={() => onClick(item.name, item.href)}
        className="flex flex-col items-center text-center p-4 hover:bg-gray-50 rounded-lg transition-colors group"
      >
        {item.imageSrc && (
          <div className="w-20 h-20 mb-3 flex items-center justify-center">
            <img
              src={item.imageSrc}
              alt={item.imageAlt || item.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform"
            />
          </div>
        )}
        <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
          {item.name}
        </span>
      </Link>
    </li>
  );
};
