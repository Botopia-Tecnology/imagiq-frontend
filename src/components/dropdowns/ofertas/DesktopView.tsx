"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { SIZES } from "./constants";
import { useOfertasDirectas } from "@/hooks/useOfertasDirectas";

type Props = Readonly<{
  onItemClick: (label: string, href: string) => void;
}>;

export function DesktopView({ onItemClick }: Props) {
  const { ofertas, loading } = useOfertasDirectas();

  const handleCloseDropdown = () => {
    globalThis.dispatchEvent(new CustomEvent("close-dropdown"));
  };

  // Skeleton loading state
  if (loading) {
    return (
      <div className="bg-white py-8 px-6 relative">
        <button
          onClick={handleCloseDropdown}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <div className="flex gap-x-8">
          <div className="flex-1 pl-8">
            {/* Una sola fila: 5 skeleton items */}
            <div className="grid grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="flex flex-col items-center"
                  style={{ width: `${SIZES.product.container}px` }}
                >
                  <div
                    className="bg-gray-200 animate-pulse rounded mb-2"
                    style={{
                      width: `${SIZES.product.image}px`,
                      height: `${SIZES.product.image}px`,
                    }}
                  />
                  <div className="h-8 bg-gray-200 animate-pulse rounded w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Agrupar ofertas por categoría (nombreVisible)
  const ofertasPorCategoria = ofertas.reduce((acc, oferta) => {
    const categoria = oferta.categoria?.nombreVisible || "Otros";
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(oferta);
    return acc;
  }, {} as Record<string, typeof ofertas>);

  // Ordenar categorías alfabéticamente
  const categoriasOrdenadas = Object.keys(ofertasPorCategoria).sort();

  return (
    <div className="bg-white py-6 relative">
      <button
        onClick={handleCloseDropdown}
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Cerrar"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>

      {ofertas.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-2xl font-bold text-gray-900 mb-2">Próximamente</p>
          <p className="text-sm text-gray-600">
            Estamos preparando increíbles ofertas para ti
          </p>
        </div>
      ) : (
        <div className="w-full pl-4 pr-8">
          {/* Grid de categorías - se adapta al número de categorías */}
          <div
            className="grid w-full gap-x-10 gap-y-8"
            style={{
              gridTemplateColumns: `repeat(${categoriasOrdenadas.length}, minmax(${SIZES.product.container}px, 1fr))`,
            }}
          >
            {categoriasOrdenadas.map((categoria) => (
              <div key={categoria}>
                {/* Nombre de la categoría */}
                <h3 className="text-sm font-bold text-gray-900 mb-4 text-left">
                  {categoria}
                </h3>

                {/* Productos de esta categoría en columna */}
                <div className="flex flex-col gap-y-4 items-start">
                  {ofertasPorCategoria[categoria].map((oferta) => {
                    const href = `/productos/viewpremium/${oferta.codigo_market}`;

                    return (
                      <Link
                        key={oferta.uuid}
                        href={href}
                        onClick={() =>
                          onItemClick(
                            oferta.producto.nombreMarket || oferta.nombre,
                            href
                          )
                        }
                        className="flex flex-row items-center gap-3 group"
                        style={{
                          width: `${SIZES.product.container + 100}px`,
                        }}
                      >
                        <div
                          className="relative flex-shrink-0 transition-transform group-hover:scale-105"
                          style={{
                            width: `${SIZES.product.image}px`,
                            height: `${SIZES.product.image}px`,
                          }}
                        >
                          {oferta.producto.imagen ? (
                            <Image
                              src={oferta.producto.imagen}
                              alt={
                                oferta.producto.nombreMarket || oferta.nombre
                              }
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                              <span className="text-gray-400 text-xs">
                                Sin imagen
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-gray-900 leading-snug line-clamp-3 flex-1">
                          {oferta.producto.nombreMarket || oferta.nombre}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
