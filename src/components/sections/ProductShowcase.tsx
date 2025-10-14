/**
 * 📱 PRODUCT SHOWCASE - 4 Product Cards
 *
 * Muestra 4 productos destacados en formato de grid
 * - Galaxy S25 FE + Buds3 FE
 * - Galaxy S25 Ultra 256 GB
 * - Galaxy Tab S11 256GB + Adaptador
 * - Galaxy Watch8 Classic de 40 mm
 */

"use client";

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { posthogUtils } from "@/lib/posthogClient";

// Importar imágenes
import s25feImg from "@/img/dispositivosmoviles/cel1.png";
import s25ultraImg from "@/img/dispositivosmoviles/cel2.png";
import tabletImg from "@/img/tabletas/tableta1.png";
import watchImg from "@/img/categorias/galaxy_watch.png";

interface Product {
  id: string;
  title: string;
  image: StaticImageData;
  href: string;
}

const products: Product[] = [
  {
    id: "s25-fe-buds",
    title: "Galaxy S25 FE + Buds3 FE",
    image: s25feImg,
    href: "/productos/smartphones/galaxy-s25-fe",
  },
  {
    id: "s25-ultra",
    title: "Galaxy S25 Ultra 256 GB",
    image: s25ultraImg,
    href: "/productos/smartphones/galaxy-s25-ultra",
  },
  {
    id: "tab-s11",
    title: "Galaxy Tab S11 256GB + Adaptador",
    image: tabletImg,
    href: "/productos/tablets/galaxy-tab-s11",
  },
  {
    id: "watch8-classic",
    title: "Galaxy Watch8 Classic de 40 mm",
    image: watchImg,
    href: "/productos/wearables/galaxy-watch8-classic",
  },
];

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    posthogUtils.capture("product_showcase_card_click", {
      product_id: product.id,
      product_title: product.title,
      source: "product_showcase",
    });
  };

  return (
    <Link
      href={product.href}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group block h-full"
    >
      <div className="relative bg-gray-50 h-full flex flex-col items-center justify-between p-6 hover:bg-gray-100 transition-colors duration-300">
        {/* Título */}
        <h3
          className="text-base font-semibold text-gray-900 text-center leading-tight h-[48px] flex items-center justify-center w-full"
          style={{ fontFamily: "'Samsung Sharp Sans', sans-serif" }}
        >
          {product.title}
        </h3>

        {/* Imagen del producto */}
        <div className="relative w-full flex-1 flex items-center justify-center">
          <div className="relative w-[200px] h-[200px]">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className={`object-contain transition-transform duration-500 ease-out ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              sizes="200px"
            />
          </div>
        </div>

        {/* Botón Comprar - Visible siempre en mobile, aparece en hover en desktop */}
        <div
          className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 md:opacity-0 md:translate-y-4 ${
            isHovered ? "md:opacity-100 md:translate-y-0" : ""
          } opacity-100 translate-y-0`}
        >
          <button
            className="bg-black text-white px-10 py-3 rounded-full font-semibold text-base transition-transform duration-300 transform hover:scale-105 shadow-xl whitespace-nowrap"
            style={{
              fontFamily: "'Samsung Sharp Sans', sans-serif",
            }}
          >
            Comprar
          </button>
        </div>

        {/* Espacio para mantener consistencia */}
        <div className="h-[48px]"></div>
      </div>
    </Link>
  );
}

export default function ProductShowcase() {
  return (
    <section className="w-full flex justify-center bg-white pt-[25px] pb-0">
      <div className="w-full" style={{ maxWidth: "1440px" }}>
        {/* Desktop: Grid 4 columnas */}
        <div className="hidden md:grid md:grid-cols-4 gap-[25px]">
          {products.map((product) => (
            <div key={product.id} className="w-full h-[420px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile: Scroll horizontal */}
        <div className="md:hidden overflow-x-auto scrollbar-hide">
          <div className="flex gap-[25px] px-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[280px] h-[420px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
