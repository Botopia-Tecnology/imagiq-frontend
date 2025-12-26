import Image from 'next/image';
import { ZeroInterestSkuResult } from '@/services/cero-interes-sku.service';

interface CeroInteresLogosProps {
  entidades: ZeroInterestSkuResult[];
}

/**
 * Componente que muestra logos de bancos con cero interés
 * 
 * Mapeo de códigos de entidad:
 * - C2 = Bancolombia
 * - C1 = Davivienda
 * 
 * Las imágenes son clickeables y abren los términos y condiciones
 * en una nueva pestaña.
 */
export default function CeroInteresLogos({ entidades }: CeroInteresLogosProps) {
  if (!entidades || entidades.length === 0) {
    return null;
  }

  // Agrupar por codEntidad para evitar duplicados
  const uniqueEntidades = entidades.reduce((acc, curr) => {
    if (!acc.some((e) => e.codEntidad === curr.codEntidad)) {
      acc.push(curr);
    }
    return acc;
  }, [] as ZeroInterestSkuResult[]);

  return (
    <div className="flex items-center justify-center gap-2 mt-2">
      {uniqueEntidades.map((entidad) => {
        const imageUrl =
          entidad.codEntidad === 'C2'
            ? 'https://res.cloudinary.com/dzi2p0pqa/image/upload/v1764208167/9ba50675-1fbc-49b8-9d8b-9b671a7ebb3c.png' // Bancolombia
            : entidad.codEntidad === 'C1'
            ? 'https://res.cloudinary.com/dzi2p0pqa/image/upload/v1764208738/6c915dfc-5191-4308-aeac-169cb3b6d79e.png' // Davivienda
            : null;

        if (!imageUrl) return null;

        return (
          <a
            key={entidad.codEntidad}
            href={entidad.urlTerminos}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:opacity-80 transition-opacity"
            aria-label={`Ver términos y condiciones de ${entidad.entidad}`}
          >
            <Image
              src={imageUrl}
              alt={`Logo ${entidad.entidad}`}
              width={25}
              height={25}
              className="object-contain"
            />
          </a>
        );
      })}
    </div>
  );
}
