"use client";

import Image from "next/image";
import Link from "next/link";

const productCategories = [
  {
    name: "Móvil",
    image: "/soporte/movil.png",
    href: "/soporte/productos/movil",
  },
  {
    name: "Televisión y audiovisuales",
    image: "/soporte/tv.png",
    href: "/soporte/productos/tv",
  },
  {
    name: "Electrodomésticos",
    image: "/soporte/electrodomesticos.png",
    href: "/soporte/productos/electrodomesticos",
  },
  {
    name: "Computación",
    image: "/soporte/computacion.png",
    href: "/soporte/productos/computacion",
  },
  {
    name: "Pantallas",
    image: "/soporte/pantallas.png",
    href: "/soporte/productos/pantallas",
  },
  {
    name: "APLICACIONES Y SERVICIOS",
    image: "/soporte/apps.png",
    href: "/soporte/productos/apps",
  },
];

export function ProductsSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 pb-8">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Soporte para productos
      </h2>

      <div className="flex items-center justify-center gap-4 mb-12">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Ingresa tu número de modelo"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
        <Link
          href="#"
          className="text-sm underline hover:no-underline whitespace-nowrap"
        >
          Cómo encontrar el código de modelo
        </Link>
      </div>

      {/* Product Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {productCategories.map((category, index) => (
          <Link
            key={index}
            href={category.href}
            className="group"
          >
            <div className="bg-gray-100 rounded-2xl p-6 w-full h-44 group-hover:bg-gray-200 transition-colors flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 mb-4">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-center text-sm font-medium leading-tight">
                {category.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
