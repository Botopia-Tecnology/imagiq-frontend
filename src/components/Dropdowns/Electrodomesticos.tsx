/**
 * 🏠 DROPDOWN ELECTRODOMÉSTICOS - IMAGIQ ECOMMERCE
 *
 * Dropdown simple del navbar con solo títulos y estilos, sin imágenes.
 */

"use client";

import Link from "next/link";
import { posthogUtils } from "@/lib/posthogClient";

interface DropdownProps {
  position?: {
    top: number;
    left: number;
  };
}

const categories = [
  {
    name: "Refrigeradores",
    href: "/productos/Electrodomesticos?section=refrigeradores",
  },
  {
    name: "Lavadoras",
    href: "/productos/Electrodomesticos?section=lavadoras",
  },
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

export default function ElectrodomesticosDropdown({
  position = { top: 60, left: 450 },
}: DropdownProps) {
  const handleItemClick = (itemName: string, href: string) => {
    posthogUtils.capture("dropdown_item_click", {
      category: "Electrodomésticos",
      item: itemName,
      href: href,
    });
  };

  return (
    <div
      data-dropdown="electrodomesticos"
      className="fixed bg-white rounded-xl shadow-xl border border-gray-100 py-3 px-5 min-w-[240px]"
      style={{
        zIndex: 999999,
        top: position.top + 5,
        left: position.left - 120,
        transform: "none",
        boxShadow:
          "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="space-y-1.5">
        {categories.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="block text-gray-800 hover:text-gray-900 text-base font-medium py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-all duration-150"
            onClick={() => handleItemClick(item.name, item.href)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
