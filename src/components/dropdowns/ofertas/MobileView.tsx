"use client";

import Link from "next/link";
import Image from "next/image";
import { useOfertasDestacadas } from "@/hooks/useOfertasDestacadas";

type Props = Readonly<{
  onItemClick: (label: string, href: string) => void;
}>;

export function MobileView({ onItemClick }: Props) {
  const { productos, loading } = useOfertasDestacadas();

  if (loading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={`skeleton-mobile-${i}`} className="flex flex-col items-center">
              <div className="relative w-16 h-16 mb-2 bg-gray-200 animate-pulse rounded" />
              <div className="h-8 bg-gray-200 animate-pulse rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {productos.map((producto) => {
          const href = producto.link_url || `/productos/view/${producto.producto_id}`;

          return (
            <Link
              key={producto.uuid}
              href={href}
              onClick={() => onItemClick(producto.producto_nombre, href)}
              className="flex flex-col items-center text-center"
            >
              <div className="relative w-16 h-16 mb-2">
                {producto.producto_imagen ? (
                  <Image
                    src={producto.producto_imagen}
                    alt={producto.producto_nombre}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                    <span className="text-gray-400 text-[8px]">Sin imagen</span>
                  </div>
                )}
              </div>
              <span className="text-xs font-semibold text-gray-900 line-clamp-2">
                {producto.producto_nombre}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
