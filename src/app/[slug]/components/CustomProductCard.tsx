/**
 * Product Card personalizada para landing pages
 * Muestra imagen, título, subtítulo, descripción y CTA
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ProductCardData } from '@/services/multimedia-pages.service';

interface CustomProductCardProps {
  card: ProductCardData;
}

export default function CustomProductCard({ card }: CustomProductCardProps) {
  const content = (
    <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Imagen */}
      <div className="relative w-full aspect-square">
        <Image
          src={card.image_url}
          alt={card.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Contenido de texto */}
      <div className="p-4 md:p-6">
        {/* Subtitle (etiqueta superior) */}
        {card.subtitle && (
          <p className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            {card.subtitle}
          </p>
        )}

        {/* Título */}
        <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {card.title}
        </h4>

        {/* Descripción */}
        {card.description && (
          <p className="text-sm md:text-base text-gray-600 mb-4 line-clamp-3">
            {card.description}
          </p>
        )}

        {/* CTA Button */}
        {card.cta_text && (
          <button className="w-full bg-black text-white py-2 px-4 rounded-full font-semibold text-sm md:text-base hover:bg-gray-800 transition-colors duration-200">
            {card.cta_text}
          </button>
        )}
      </div>
    </div>
  );

  // Si tiene CTA URL, envolver en Link
  if (card.cta_url) {
    return (
      <Link href={card.cta_url} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
