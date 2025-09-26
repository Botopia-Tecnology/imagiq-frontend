/**
 * 🏠 DROPDOWN ELECTRODOMÉSTICOS - IMAGIQ ECOMMERCE
 *
 * Dropdown simple del navbar con solo títulos y estilos, sin imágenes.
 */

"use client";

import Link from "next/link";
import { posthogUtils } from "@/lib/posthogClient";
import { cn } from "@/lib/utils";

const categories = [
  {
    name: "Refrigeradores",
    href: "/productos/electrodomesticos?section=refrigeradores",
  },
  {
    name: "Lavadoras",
    href: "/productos/electrodomesticos?section=lavadoras",
  },
  {
    name: "Lavavajillas",
    href: "/productos/electrodomesticos?section=lavavajillas",
  },
  {
    name: "Aire Acondicionado",
    href: "/productos/electrodomesticos?section=aire-acondicionado",
  },
  {
    name: "Microondas",
    href: "/productos/electrodomesticos?section=microondas",
  },
  {
    name: "Aspiradoras",
    href: "/productos/electrodomesticos?section=aspiradoras",
  },
  {
    name: "Hornos",
    href: "/productos/electrodomesticos?section=hornos",
  },
];

export default function ElectrodomesticosDropdown({
  isMobile = false,
  onItemClick,
}: {
  isMobile?: boolean;
  onItemClick?: () => void;
}) {
  const handleItemClick = (itemName: string, href: string) => {
    posthogUtils.capture("dropdown_item_click", {
      category: "Electrodomésticos",
      item: itemName,
      href: href,
    });
    if (onItemClick) {
      onItemClick(); // Cierra menú móvil
    }
  };

  return (
    <div
      data-dropdown="refrigeradores"
       className={cn(
              "z-50 bg-white rounded-xl shadow-xl border border-gray-100 py-3 px-5 min-w-[200px] transition-all duration-200",
              !isMobile && "absolute top-full left-0"
            )}
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
