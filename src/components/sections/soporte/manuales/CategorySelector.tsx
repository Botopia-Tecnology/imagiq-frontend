"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Móvil",
    image: "/soporte/icon-moviles.svg",
    href: "#",
  },
  {
    name: "TV & AV",
    image: "/soporte/icon-smart-tv.svg",
    href: "#",
  },
  {
    name: "Electrodomésticos",
    image: "/soporte/guia-electrodomesticos.svg",
    href: "#",
  },
  {
    name: "Informática",
    image: "/soporte/dispositivos-moviles.svg",
    href: "#",
  },
  {
    name: "Pantallas",
    image: "/soporte/icon-smart-tv.svg",
    href: "#",
  },
];

export function CategorySelector() {
  return (
    <div className="bg-white py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          O selecciona una categoría
        </h2>

        <div className="mb-4">
          <h3 className="text-sm font-semibold mb-4">
            Paso 1. Selecciona una categoría de producto
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="group flex flex-col items-center"
              >
                <div className="w-full aspect-square bg-gray-100 border border-gray-200 rounded-lg overflow-hidden mb-2 hover:shadow-md transition-shadow">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm font-medium text-center">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
