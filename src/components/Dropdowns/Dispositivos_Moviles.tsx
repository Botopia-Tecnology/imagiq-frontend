"use client";

import Link from "next/link";
import { posthogUtils } from "@/lib/posthogClient";

const dispositivosMoviles = [
  {
    name: "Smartphones",
    href: "/productos/DispositivosMoviles?section=smartphones",
  },
  { name: "Tabletas", href: "/productos/DispositivosMoviles?section=tabletas" },
  { name: "Relojes", href: "/productos/DispositivosMoviles?section=relojes" },
  { name: "Galaxy Buds", href: "/productos/DispositivosMoviles?section=buds" },
  {
    name: "Accesorios",
    href: "/productos/DispositivosMoviles?section=accesorios",
  },
];

export default function DispositivosMovilesDropdown() {
  const handleItemClick = (itemName: string, href: string) => {
    posthogUtils.capture("dropdown_item_click", {
      category: "Dispositivos móviles",
      item: itemName,
      href: href,
    });
  };

  return (
    <div className="absolute top-full left-12 transform -translate-x-1/6 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-3 px-5 min-w-[200px] z-[70] animate-dropdown-enter">
      <div className="space-y-1.5">
        {dispositivosMoviles.map((item, index) => (
          <Link
            key={item.name}
            href={item.href}
            className="block text-gray-800 hover:text-gray-900 text-base font-medium py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-all duration-150 animate-dropdown-item"
            onClick={() => handleItemClick(item.name, item.href)}
            style={{
              animationDelay: `${index * 30}ms`,
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
