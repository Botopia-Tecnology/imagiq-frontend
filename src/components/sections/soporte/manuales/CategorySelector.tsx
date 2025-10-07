"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Móvil",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759802825/full_daily-removebg-preview_lm98i8.png",
    href: "#",
  },
  {
    name: "TV & AV",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759803027/tele-removebg-preview_wbfjld.png",
    href: "#",
  },
  {
    name: "Electrodomésticos",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759803497/nevera-removebg-preview_yiibzg.png",
    href: "#",
  },
  {
    name: "Informática",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759803836/co-odyssey-oled-g8-g85sb-ls34bg850snxza-534663632-removebg-preview_ajloex.png",
    href: "#",
  },
  {
    name: "Pantallas",
    image: "https://res.cloudinary.com/dcljjtnxr/image/upload/v1759812842/co-smart-signage-qb13r-t-b2c-lh13qbrtbgcxza-533631483-removebg-preview_is2skp.png",
    href: "#",
  },
];

export function CategorySelector() {
  return (
    <div className="bg-white pt-4 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          O selecciona una categoría
        </h2>

        <div className="mb-6">
          <h3 className="text-lg font-bold mb-6">
            Paso 1. Selecciona una categoría de producto
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="group"
              >
                <div className="w-full bg-gray-100 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow p-6 flex flex-col items-center justify-center h-52">
                  <div className="relative w-24 h-24 mb-4">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-base font-bold text-center leading-tight">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Línea separadora */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="w-full h-px bg-gray-200"></div>
      </div>
    </div>
  );
}
