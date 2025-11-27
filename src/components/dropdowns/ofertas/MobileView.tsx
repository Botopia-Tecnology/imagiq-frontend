"use client";

import Link from "next/link";
import Image from "next/image";
import { useOfertasDirectas } from "@/hooks/useOfertasDirectas";

type Props = Readonly<{
  onItemClick: (label: string, href: string) => void;
}>;

export function MobileView({ onItemClick }: Props) {
  const { ofertas, loading } = useOfertasDirectas();

  if (loading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={`skeleton-mobile-${i}`}
              className="flex flex-col items-center"
            >
              <div className="relative w-16 h-16 mb-2 bg-gray-200 animate-pulse rounded" />
              <div className="h-8 bg-gray-200 animate-pulse rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (ofertas.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-xl font-bold text-gray-900 mb-1">Próximamente</p>
        <p className="text-xs text-gray-600">
          Estamos preparando increíbles ofertas para ti
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {ofertas.map((oferta) => {
          const href = `/productos/viewpremium/${oferta.codigo_market}`;

          return (
            <Link
              key={oferta.uuid}
              href={href}
              onClick={() =>
                onItemClick(oferta.nombre, href)
              }
              className="flex flex-col items-center text-center"
            >
              <div className="relative w-16 h-16 mb-2">
                {oferta.producto.imagen ? (
                  <Image
                    src={oferta.producto.imagen}
                    alt={oferta.nombre}
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
                {oferta.nombre}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
