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
  // Obtener colores desde text_styles o usar valores por defecto
  const titleColor = card.text_styles?.title?.color || "#ffffff"
  const subtitleColor = card.text_styles?.subtitle?.color || "#ffffff"
  const descriptionColor = card.text_styles?.description?.color || "#ffffff"
  const ctaTextColor = card.text_styles?.cta?.color || "#000000"
  const ctaBackgroundColor = card.text_styles?.cta?.backgroundColor || "#ffffff"
  
  const content = (
    <div className="group relative w-full aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
      {/* Imagen de fondo */}
      <Image
        src={card.image_url}
        alt={card.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* Contenido de texto sobre la imagen */}
      <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-start">
        {/* Subtitle (etiqueta superior) */}
        {card.subtitle && (
          <p 
            className="text-xs md:text-sm font-bold uppercase tracking-wide mb-2"
            style={{ color: subtitleColor }}
          >
            {card.subtitle}
          </p>
        )}

        {/* Título */}
        <h4 
          className="text-lg md:text-xl lg:text-2xl font-bold mb-2 line-clamp-2"
          style={{ color: titleColor }}
        >
          {card.title}
        </h4>

        {/* Descripción */}
        {card.description && (
          <p 
            className="text-sm mb-4 line-clamp-3 font-bold"
            style={{ color: descriptionColor }}
          >
            {card.description}
          </p>
        )}

        {/* CTA Button */}
        {card.cta_text && (
          <button 
            className="w-fit py-2 px-6 rounded-full font-semibold text-sm md:text-base hover:opacity-90 transition-opacity duration-200"
            style={{ 
              color: ctaTextColor,
              backgroundColor: ctaBackgroundColor
            } as React.CSSProperties}
          >
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
