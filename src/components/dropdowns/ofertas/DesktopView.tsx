"use client";

import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { SIZES } from "./constants";
import { useTopDiscountedProducts } from "@/hooks/useTopDiscountedProducts";

type Props = Readonly<{
  onItemClick: (label: string, href: string) => void;
}>;

export function DesktopView({ onItemClick }: Props) {
  const { products, loading } = useTopDiscountedProducts({
    limit: 12,
  });

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
            {/* Primera fila: 7 skeleton items */}
            <div className="grid grid-cols-7 gap-6 mb-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={`skeleton-top-${i}`} className="flex flex-col items-center" style={{ width: `${SIZES.product.container}px` }}>
                  <div
                    className="bg-gray-200 animate-pulse rounded mb-2"
                    style={{ width: `${SIZES.product.image}px`, height: `${SIZES.product.image}px` }}
                  />
                  <div className="h-8 bg-gray-200 animate-pulse rounded w-full" />
                </div>
              ))}
            </div>

            {/* Segunda fila: 5 skeleton items */}
            <div className="grid grid-cols-7 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-bottom-${i}`} className="flex flex-col items-center" style={{ width: `${SIZES.product.container}px` }}>
                  <div
                    className="bg-gray-200 animate-pulse rounded mb-2"
                    style={{ width: `${SIZES.product.image}px`, height: `${SIZES.product.image}px` }}
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
          {/* Primera fila: 7 productos */}
          <div className="grid grid-cols-7 gap-6 mb-4">
            {products.slice(0, 7).map((product) => {
              if (typeof product.image !== 'string' || !product.image) return null;

              return (
                <Link
                  key={product.id}
                  href={`/productos/view/${product.id}`}
                  onClick={() => onItemClick(product.name, `/productos/view/${product.id}`)}
                  className="flex flex-col items-center text-center group"
                  style={{ width: `${SIZES.product.container}px` }}
                >
                  <div
                    className="relative mb-2 transition-transform group-hover:scale-105"
                    style={{ width: `${SIZES.product.image}px`, height: `${SIZES.product.image}px` }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-900 leading-tight line-clamp-2">
                    {product.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Segunda fila: 5 productos */}
          <div className="grid grid-cols-7 gap-6">
            {products.slice(7, 12).map((product) => {
              if (typeof product.image !== 'string' || !product.image) return null;

              return (
                <Link
                  key={product.id}
                  href={`/productos/view/${product.id}`}
                  onClick={() => onItemClick(product.name, `/productos/view/${product.id}`)}
                  className="flex flex-col items-center text-center group"
                  style={{ width: `${SIZES.product.container}px` }}
                >
                  <div
                    className="relative mb-2 transition-transform group-hover:scale-105"
                    style={{ width: `${SIZES.product.image}px`, height: `${SIZES.product.image}px` }}
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-900 leading-tight line-clamp-2">
                    {product.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
