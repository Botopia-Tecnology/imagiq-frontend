"use client";

import Link from "next/link";
import Image from "next/image";
import { useTopDiscountedProducts } from "@/hooks/useTopDiscountedProducts";

type Props = Readonly<{
  onItemClick: (label: string, href: string) => void;
}>;

export function MobileView({ onItemClick }: Props) {
  const { products, loading } = useTopDiscountedProducts({
    limit: 12,
  });

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
        {products.map((product) => {
          if (typeof product.image !== 'string' || !product.image) return null;

          return (
            <Link
              key={product.id}
              href={`/productos/view/${product.id}`}
              onClick={() => onItemClick(product.name, `/productos/view/${product.id}`)}
              className="flex flex-col items-center text-center"
            >
              <div className="relative w-16 h-16 mb-2">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs font-semibold text-gray-900 line-clamp-2">
                {product.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
