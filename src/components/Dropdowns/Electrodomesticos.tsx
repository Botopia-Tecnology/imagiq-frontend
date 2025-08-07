/**
 * 🏠 DROPDOWN ELECTRODOMÉSTICOS - IMAGIQ ECOMMERCE
 *
 * Dropdown simple del navbar con solo títulos y estilos, sin imágenes.
 */

"use client";

import Link from "next/link";
import { posthogUtils } from "@/lib/posthogClient";

const categories = [
  {
    name: "Refrigeradores",
    href: "/productos/Electrodomesticos?section=refrigeradores",
  },
  { name: "Lavadoras", href: "/productos/Electrodomesticos?section=lavadoras" },
  {
    name: "Lavavajillas",
    href: "/productos/Electrodomesticos?section=lavavajillas",
  },
  {
    name: "Aire Acondicionado",
    href: "/productos/Electrodomesticos?section=aire-acondicionado",
  },
  {
    name: "Microondas",
    href: "/productos/Electrodomesticos?section=microondas",
  },
  {
    name: "Aspiradoras",
    href: "/productos/Electrodomesticos?section=aspiradoras",
  },
];

export default function ElectrodomesticosDropdown() {
  const handleItemClick = (itemName: string, href: string) => {
    posthogUtils.capture("dropdown_item_click", {
      category: "Electrodomésticos",
      item: itemName,
      href: href,
    });
  };

  return (
    <div className="absolute top-full left-10 transform -translate-x-1/6 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-3 px-5 min-w-[240px] z-[70] animate-dropdown-enter">
      <div className="space-y-1.5">
        {categories.map((item, index) => (
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
