"use client";

import Link from "next/link";
import { posthogUtils } from "@/lib/posthogClient";

const televisionesAV = [
  { name: "Televisores", href: "/televisores-av/televisores" },
  { name: "Dispositivos de audio", href: "/televisores-av/dispositivos-audio" },
  { name: "Proyectores", href: "/televisores-av/proyectores" },
  { name: "Accesorios para TV", href: "/televisores-av/accesorios-tv" },
];

export default function TelevisionesDropdown() {
  const handleItemClick = (itemName: string, href: string) => {
    posthogUtils.capture("dropdown_item_click", {
      category: "Televisores y AV",
      item: itemName,
      href: href,
    });
  };

  return (
    <div className="absolute top-full left-10 transform -translate-x-1/6 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-3 px-5 min-w-[220px] z-[60] animate-dropdown-enter">
      <div className="space-y-1.5">
        {televisionesAV.map((item, index) => (
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
